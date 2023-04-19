import {GraphQLClient} from "graphql-request";
import {issueCommentsQuery} from "./queries.ts";
import {
    Comment,
    Commentable,
    CommentablesPage,
    CommentableType,
    CommentsPage,
    IssueCommentsResponse,
    QueryVars,
    ResponseComment,
    ResponseIssue
} from "../lib/types/index.ts";
import {FetchResult} from "../lib/types/fetch";

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
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
    } as Comment;
}

// TODO: move
interface Timestamped {
    createdAt: string;
}

/**
 * Compares two objects based on their 'createdAt' property values in descending order.
 *
 * @function
 * @param {Object} a - The first object to compare.
 * @param {Object} b - The second object to compare.
 * @returns {number} A negative, positive, or zero value, which can be used as a sorting parameter in Array.sort().
 * A negative value indicates that 'a' should come after 'b' (since we are sorting in descending order),
 * a positive value indicates that 'a' should come before 'b', and a zero value indicates that their order does not matter.
 */
function byCreatedAt(a: Timestamped, b: Timestamped) {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

export async function fetchIssueComments(client: GraphQLClient, queryVars: QueryVars): Promise<FetchResult> {
    console.log("fetchIssueComments")

    const {owner, name, pageSize} = queryVars;
    const pageVars = queryVars.pageVars ?? {};
    const issuesResponse: IssueCommentsResponse = await client.request(issueCommentsQuery, {
        owner,
        name,
        maxIssues: pageSize.commentables,
        maxComments: pageSize.comments,
        afterIssue: pageVars?.commentables?.after,
        beforeIssue: pageVars?.commentables?.before,
        afterComment: pageVars?.comments?.after,
    });

    console.log("got issue comments resopnse")
    const {nodes: responseIssues, pageInfo: {hasNextPage, endCursor}} = issuesResponse.repository.issues
    // check if there's another page of issues
    let nextIssuePage: CommentablesPage | undefined;
    if (hasNextPage) {
        nextIssuePage = {
            commentableType: CommentableType.ISSUE,
            after: endCursor,
        };
    }

    // collect & normalize all issues
    const normalizedIssues: Commentable[] = responseIssues.map(issue => ({
        id: issue.id,
        type: CommentableType.ISSUE,
    }));

    // collect & normalize `Comment`s from issues w/o more comments
    const normalizedIssueComments = responseIssues
        .flatMap((issue: ResponseIssue) => issue.comments.nodes)
        .map(normalizeResponseComment);

    // partition issues into w/ and w/o more comments
    // TODO: refactor
    const [_, issuesWithMoreComments] = partition(responseIssues, hasMoreComments);

    // create `CommentsPage`s from issues w/ more comments
    // TODO: refactor (normalize)
    const nextCommentsPages = issuesWithMoreComments.map(issue => {
        const {
            pageInfo: {endCursor}
        } = issue.comments;
        return {
            commentableType: CommentableType.ISSUE,
            commentableId: issue.id,
            afterComment: endCursor,
        } as CommentsPage;
    });

    return {
        commentables: normalizedIssues,
        // sort issueComments by createdAt in descending order (i.e. newest first)
        comments: normalizedIssueComments.sort(byCreatedAt),
        next: {
            commentables: nextIssuePage,
            comments: nextCommentsPages,
        },
    };
}

export async function fetchCommentsPage(client: GraphQLClient, page: CommentsPage, {
    owner,
    name,
    PRs,
    issues,
}: QueryVars): Promise<Comment[]> {
    const {commentableId, afterComment} = page;

    // issues: {
    //   before: commentableId,
    //   comments: {after: afterComment, max: 100}
    // }

    // TODO: check `page.commentableType` and call PR query if PR
    const {repository: {issues: {nodes}}}: IssueCommentsResponse = await client.request(issueCommentsQuery, {
        owner,
        name,
        maxIssues: 1,
        beforeIssue: commentableId,
        // TODO: parameterize max
        maxComments: 100,
        afterComment,
    })

    // TODO: refactor w/ normalizedIssueComments flatMap fn
    return nodes.flatMap((issue: ResponseIssue) => issue.comments.nodes).map(normalizeResponseComment)

    // TODO: encuque if `pageInfo.hasNextPage`
}