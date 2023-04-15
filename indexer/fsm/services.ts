import Queue from "bull";

import {Context} from "./types.js";
import {Comment, CommentsPage, Commentable} from "../../lib/types/index.js";
import {fetchIssueComments} from "../fetch.js";

export async function logUpdated(ctx: Context, event: any) {
    console.log("updated state!");
}

export async function logError(ctx: Context, event: any) {
    // TODO:
}

export async function queueAll(ctx: Context, event: any) {
    const {queryVars: {owner, name, pageSize}} = ctx;
    const {commentables, comments, next} = await fetchIssueComments(ctx.clients.github, {
        owner, name,
        PRs: {
            max: pageSize.commentables,
            comments: {max: pageSize.comments}
        },
        issues: {
            max: pageSize.commentables,
            comments: {max: pageSize.comments}
        },
    });

    const {queues} = ctx;
    // Enqueue normalized commentables and comments
    commentables.forEach((commentable: Commentable) =>
        queues.storing.commentables.add("enqueue", {commentable})
    );
    comments.forEach((comment: Comment) =>
        queues.storing.comments.add("enqueue", {comment})
    );

    // Enqueue CommentablePage and CommentPage objects for the next pages
    if (next.commentables) {
        queues.fetching.commentables.add("enqueue", {nextPage: next.commentables});
    }
    if (next.comments) {
        next.comments.forEach((commentPage: CommentsPage) =>
            queues.fetching.comments.add("enqueue", {commentPage})
        );
    }

    // Process nextCommentables queue
    const {storing, fetching} = ctx.processes;
    queues.fetching.commentables.process(
        fetching.commentables.concurrency,
        fetching.commentables.scriptPath,
    );

    // Process nextComments queue
    queues.fetching.comments.process(
        fetching.comments.concurrency,
        fetching.comments.scriptPath,
    );
}

export async function upsertAll(ctx: Context, event: any) {
    const {commentables, comments} = ctx.processes.storing;

    // Process storing commentables queue
    ctx.queues.storing.commentables.process(
        commentables.concurrency,
        commentables.scriptPath
    );

    // Process storing comments queue
    ctx.queues.storing.comments.process(
        comments.concurrency,
        comments.scriptPath,
    );
}
