import {Context} from "./types.js";
import {addCommentsToDatabase} from "../store.js";

// TODO: remove
export async function logUpdated(context: Context, event: any) {
    console.log("updated state!");
}

export async function logError(context: Context, event: any) {
    // TODO:
    console.log("event: ", event)
    // console.error(event.error)
}

export async function queueAll(context: Context, event: any) {
    await Promise.all([
        queueCommentables(context, event),
        queueComments(context, event),
    ]);

    // console.log("EVENT:")
    // console.log(event.data.machine)
    // event.data.machine.send({type: "completed"})
    // return {
    //     type:
    // }
}

export async function queueCommentables (context: Context, event: any) {

    console.log("queueCommentables called")

    await new Promise<void>(resolve => {
        setTimeout(() => {
            resolve();
        }, 500);
    });

    console.log("queueCommentables timeout");
    // return {
    //     type: 'COMMENTABLES_UPDATED',
    //     commentables: [],
    // };
}

export async function queueComments(context: Context, event: any) {
    // TODO:
    // - dequeue pendingComments
    // - query GitHub
    // - enqueue storeComments

    // const comments = await fetchNext(ghClient, {
    //     owner,
    //     name,
    //     PRs: {max: 3, comments: {max: 100}},
    //     issues: {max: 3, comments: {max: 100}},
    // })
    //
    // console.log(comments)

    console.log("queueComments called")
    await new Promise<void>(resolve => {
        setTimeout(() => {
            resolve();
            console.log("queueComments timeout");
        }, 1000);
    });

    // return {
    //     type: 'COMMENTABLES_UPDATED',
    //     // commentables: context.commentables,
    //     commentables: [],
    // };
}

export async function upsertAll(context: Context, event: any) {
    await Promise.all([
        upsertCommentables(context, event),
        upsertComments(context, event),
    ]);

    // console.log("EVENT:")
    // console.log(arguments)
    // event.data.machine.send({type: "completed"})
}

export async function upsertCommentables(context: Context, event: any) {
    // TODO:
    // - dequeue storeCommentables
    // - send postgraphile mutation
    // - return stats
    console.log("upsertCommentables called")
    await new Promise<void>(resolve => {
        setTimeout(() => {
            resolve();
            console.log("upsertCommentables timeout");
        }, 700);
    });
}

export async function upsertComments(context: Context, event: any) {
    // TODO:
    // - dequeue storeComments
    // - send postgraphile mutation
    // - return stats

    console.log("upsertComments called")
    await new Promise<void>(resolve => {
        setTimeout(() => {
            resolve();
            console.log("upsertComments timeout");
        }, 1200);
    });

    // await addCommentsToDatabase(pgClient, comments);
}
