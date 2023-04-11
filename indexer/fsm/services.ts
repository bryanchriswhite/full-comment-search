import {Context} from "./types";
import {addCommentsToDatabase} from "../store";
import {fetchNext} from "../fetch";

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

export async function queueCommentables (context: Context, event: any) {
    // TODO:
    // - dequeue pendingCommentables
    // - query GitHub
    // - enqueue storeComments
    console.log("queueCommentables called")
}

export async function queueComments(context: Context, event: any) {
    // TODO:
    // - dequeue pendingComments
    // - query GitHub
    // - enqueue storeComments
    console.log("queueComments called")

    const {
        gqlClient,
        owner,
        name
    } = context;

    const comments = await fetchNext(gqlClient, {
        owner,
        name,
        PRs: {max: 3, comments: {max: 100}},
        issues: {max: 3, comments: {max: 100}},
    })

    console.log(comments)
}

export async function upsertAll(context: Context, event: any) {
    await Promise.all([
        upsertCommentables(context, event),
        upsertComments(context, event),
    ]);
}

export async function upsertCommentables(context: Context, event: any) {
    // TODO:
    // - dequeue storeCommentables
    // - send postgraphile mutation
    // - return stats
    console.log("upsertCommentables called")
}

export async function upsertComments(context: Context, event: any) {
    // TODO:
    // - dequeue storeComments
    // - send postgraphile mutation
    // - return stats
    console.log("upsertComments called")

    // await addCommentsToDatabase(pgClient, comments);
}
