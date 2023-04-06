import {GraphQLClient} from "graphql-request";
import {issueCommentsQuery} from "./queries.js";
import {nextQueryArgs, ResponseIssue, ResponseComment, Comment} from "./types/index.js";
import {IssueCommentsResponse} from "./types/response.js";

// TODO: move
/**
 Partitions an array into two sub-arrays based on a given predicate function.
 @param array The array to partition.
 @param predicate The function used to determine which sub-array each element belongs to.
 @returns An array containing two sub-arrays, the first with elements that pass the predicate test and the second with those that fail.
 @template T The type of elements in the array.
 */
function partition<T>(array: T[], predicate: (item: T) => boolean): T[][] {
    return array.reduce((acc: T[][], item: T) => {
        acc[predicate(item) ? 0 : 1].push(item);
        return acc;
    }, [[], []]) as unknown as T[][];
}

// TODO: more response types
function hasMoreComments(issue: ResponseIssue): boolean {
   return !issue.comments.pageInfo.hasNextPage
}

function normalizeResponseComment(comment: ResponseComment) {
   return {
        id: comment.id,
        author: comment.author.login,
        body: comment.body,
        url: comment.url,
       created_at: comment.createdAt,
       updated_at: comment.updatedAt,
    } as Comment;
}

export async function fetchNext(client: GraphQLClient, {owner, name, PRs, issues}: nextQueryArgs): Promise<Comment[]> {
    const issuesResponse: IssueCommentsResponse = await client.request(issueCommentsQuery, {
        owner,
        name,
        maxIssues: 1,
        afterIssue: issues.comments.after,
        beforeIssue: issues.comments.before,
        maxComments: issues.comments.max,
        afterComment: issues.comments.after,
    })

    const { nodes: responseIssues } = issuesResponse.repository.issues
    const [issuesWithoutNext, issuesWithNext] = partition(responseIssues, hasMoreComments)

    const issueComments = issuesWithoutNext.flatMap((issue: ResponseIssue) => issue.comments.nodes)
        .map(normalizeResponseComment)

    for (const issue of issuesWithNext) {
        const commentsArgs = issues.comments;
        let currentEndCursor = commentsArgs.after;
        let currentHasNextPage = true;

        while (currentHasNextPage) {
            const issueCommentsResponse: IssueCommentsResponse = await client.request(issueCommentsQuery, {
                owner,
                name,
                maxIssues: 1,
                beforeIssue: issue.id,
                maxComments: commentsArgs.max,
                afterComment: currentEndCursor,
            })

            const { nodes: comments, pageInfo } = issue.comments;
            issueComments.push(...comments.map((normalizeResponseComment)))

            currentHasNextPage = pageInfo.hasNextPage
            currentEndCursor = pageInfo.endCursor
        }
    }

    // sort issueComments by createdAt in descending order (i.e. newest first)
    const sortedIssues = issueComments.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    
    return Promise.resolve(sortedIssues)
}
