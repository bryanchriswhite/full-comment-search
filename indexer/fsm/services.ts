import {Context} from "./types.js";
import {Comment, CommentsPage, ResponseComment} from "../../lib/types/index.js"
import {addCommentsToDatabase} from "../store.js";
import {fetchCommentsPage, fetchIssueComments} from "../fetch.js";
import {issueCommentsQuery} from "../queries";

// TODO: parameterize, move, & set default
const queueTimeout = 1000;

// TODO: remove
export async function logUpdated(context: Context, event: any) {
    console.log("updated state!");
}

export async function logError(context: Context, event: any) {
    // TODO:
}

export async function queueAll(context: Context, event: any) {
    await Promise.all([
        queueCommentables(context, event),
        queueComments(context, event),
    ]);
}

export async function queueCommentables(context: Context, event: any) {
    // TODO:
    // - dequeue pendingCommentables
    // - query GitHub
    // - enqueue storeComments
    console.log("queueCommentables called")
}

export async function queueComments(context: Context, event: any) {
    // TODO:
    // - query GitHub
    // - enqueue comments
    console.log("queueComments called")

    const {
        ghClient,
        pgClient,
        owner,
        name
    } = context;

    console.log("fetching...")
    const {commentables, comments, next} = await fetchIssueComments(ghClient, {
        owner,
        name,
        // TODO: parameterize max
        PRs: {max: 3, comments: {max: 100}},
        // TODO: parameterize max
        issues: {max: 3, comments: {max: 100}},
    });
    console.log("done!");

    // TODO: add issues to commentables queue
    context.storeCommentablesQueue.push(...commentables)
    context.storeCommentsQueue.push(...comments)

    const nextCommentables = next.commentables;
    const nextComments = next.comments;
    if (typeof nextCommentables !== "undefined") {
        context.fetchCommentablesQueue.push(nextCommentables)
    }
    if (typeof nextComments !== "undefined") {
        context.fetchCommentsQueue.push(...nextComments)
    }

    // -- dequeue fetchCommentablesQueue
    // TODO: refactor & recurse ...

    // -- dequeue fetchCommentsQueue
    // TODO: refactor (maybe with upsertComments)
    let queueTimeoutId,
        queueEmpty = false
    ;

    const resetTimeout = () => {
        queueTimeoutId = setTimeout(() => {
            queueEmpty = true
        }, queueTimeout);
    };

    resetTimeout();
    while (!queueEmpty) {
        const maybeCommentsPage: CommentsPage | undefined = context.fetchCommentsQueue.shift()
        if (typeof maybeCommentsPage === "undefined") {
            continue;
        }
        resetTimeout()

        // TODO: something more idiomatic
        const nextCommentsPage = maybeCommentsPage as unknown as CommentsPage;

        const {owner, name} = context;
        // TODO: batch and parallelize
        const x = fetchCommentsPage(ghClient, nextCommentsPage, {
            owner,
            name,
        })
    }

    console.log(`queueComments done; comments: ${comments}`)
}

export async function upsertAll(context: Context, event: any) {
    await Promise.all([
        upsertCommentables(context, event),
        upsertComments(context, event),
    ]);
}

export async function upsertCommentables(context: Context, event: any) {
    // TODO:
    // - dequeue commentables
    // - send postgraphile mutation
    // - return stats
    console.log("upsertCommentables called")
}

export async function upsertComments(context: Context, event: any) {
    // TODO:
    // - dequeue comments
    // - send postgraphile mutation
    // - return stats
    console.log("upsertComments called")

    let queueTimeoutId,
        queueEmpty = false
    ;

    const resetTimeout = () => {
        queueTimeoutId = setTimeout(() => {
            queueEmpty = true
        }, queueTimeout);
    };

    resetTimeout();
    while (!queueEmpty) {
        const maybeComment: Comment | undefined = context.storeCommentsQueue.shift()
        if (typeof maybeComment === "undefined") {
            continue;
        }
        resetTimeout()

        // TODO: something more idomatic
        const comment = maybeComment as unknown as Comment;
        // TODO: batch and parallelize
        await addCommentsToDatabase(context.pgClient, [comment]);
    }

    console.log("upsertComments done")
}
