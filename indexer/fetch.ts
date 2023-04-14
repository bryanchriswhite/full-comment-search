import {GraphQLClient} from "graphql-request";
import {issueCommentsQuery} from "./queries.js";
import {
    Comment,
    Commentable,
    CommentablesPage,
    CommentableType,
    CommentsPage,
    IssueCommentsResponse,
    nextQueryArgs,
    ResponseComment,
    ResponseIssue
} from "../lib/types/index.js";
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

export async function fetchIssueComments(client: GraphQLClient, {
    owner,
    name,
    issues
}: nextQueryArgs): Promise<FetchResult> {
    console.log("fetchIssueComments")
    const issuesResponse: IssueCommentsResponse = await client.request(issueCommentsQuery, {
        owner,
        name,
        maxIssues: issues?.max,
        maxComments: issues?.comments.max,
        afterIssue: issues?.comments.after,
        beforeIssue: issues?.comments.before,
        afterComment: issues?.comments.after,
    })

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

    const normalizedIssues: Commentable[] = responseIssues.map(issue => ({
        id: issue.id,
        type: CommentableType.ISSUE,
    }));

    const [issuesWithoutNext, issuesWithNext] = partition(responseIssues, hasMoreComments)
    // TODO: refactor - separate normalized issues from normalized comments...
    const normalizedIssueComments = issuesWithoutNext.flatMap((issue: ResponseIssue) => issue.comments.nodes)
        .map(normalizeResponseComment)

    // TODO: refactor (normalize)
    const pendingCommentsPages = issuesWithNext.map(issue => {
        const {
            pageInfo: {endCursor}
        } = issue.comments;
        return {
            commentableType: CommentableType.ISSUE,
            commentableId: issue.id,
            afterComment: endCursor,
        } as CommentsPage;
    })

    return {
        // TODO: normalize issues (drop unused properties)
        commentables: normalizedIssues,
        // sort issueComments by createdAt in descending order (i.e. newest first)
        comments: normalizedIssueComments.sort(byCreatedAt),
        next: {
            commentables: nextIssuePage,
            comments: pendingCommentsPages,
        },
    };
}

export async function fetchCommentsPage(client: GraphQLClient, page: CommentsPage, {
    owner,
    name,
    PRs,
    issues,
}: nextQueryArgs): Promise<Comment[]> {
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