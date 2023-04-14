import Queue from "bull";

import {Context} from "./types.js";
import {Comment, CommentsPage, Commentable, CommentablesPage} from "../../lib/types/index.js";
import {addCommentsToDatabase} from "../store.js";
import {fetchIssueComments, fetchCommentsPage} from "../fetch.js";

const queueTimeout = 1000;
const commentablesPageSize = 3;
const commentsPageSize = 100;
export async function logUpdated(context: Context, event: any) {
    console.log("updated state!");
}

export async function logError(context: Context, event: any) {
    console.log("error occurred:", event);
    // TODO:
}

export async function queueAll(context: Context, event: any) {
    console.log("queueAll started");

    const {ghClient, pgClient, owner, name} = context;
    const {commentables, comments, next} = await fetchIssueComments(ghClient, {
        owner,
        name,
        PRs: {max: commentablesPageSize, comments: {max: commentsPageSize}},
        issues: {max: commentablesPageSize, comments: {max: commentsPageSize}},
    });

    const pendingCommentablesQueue = new Queue("pendingCommentables");
    const pendingCommentsQueue = new Queue("pendingComments");
    const nextCommentablesQueue = new Queue("nextCommentables");
    const nextCommentsQueue = new Queue("nextComments");

    // Enqueue normalized commentables and comments
    console.log("enqueuing commentables and comments");
    commentables.forEach((commentable: Commentable) =>
        pendingCommentablesQueue.add("enqueue", {commentable})
    );
    comments.forEach((comment: Comment) =>
        pendingCommentsQueue.add("enqueue", {comment})
    );

    // Enqueue CommentablePage and CommentPage objects for the next pages
    console.log("enqueuing next pages");
    if (next.commentables) {
        nextCommentablesQueue.add("enqueue", {nextPage: next.commentables});
    }
    if (next.comments) {
        next.comments.forEach((commentPage: CommentsPage) =>
            nextCommentsQueue.add("enqueue", {commentPage})
        );
    }

    // Process pendingCommentables queue
    pendingCommentablesQueue.process(async (job) => {
        console.log("processing pendingCommentables queue");
        const {commentable} = job.data;
        // TODO: Mutate commentables using Postgraphile
    });

    // Process pendingComments queue
    pendingCommentsQueue.process(async (job) => {
        console.log("processing pendingComments queue");
        const {comment} = job.data;
        await addCommentsToDatabase(context.pgClient, [comment]);
    });

    // Process nextCommentables queue
    nextCommentablesQueue.process(async (job) => {
        console.log("processing nextCommentables queue");
        const {nextPage} = job.data;
        const {commentables: nextCommentables, comments: nextComments} = await fetchIssueComments(ghClient, {
            owner,
            name,
            PRs: {max: commentablesPageSize, comments: {max: commentsPageSize}},
            issues: {max: commentablesPageSize, comments: {max: commentsPageSize}},
            ...nextPage,
        });

        nextCommentables.forEach((commentable: Commentable) =>
            pendingCommentablesQueue.add("enqueue", {commentable})
        );
        nextComments.forEach((comment: Comment) =>
            pendingCommentsQueue.add("enqueue", {comment})
        );
    });

    // Process nextComments queue
    nextCommentsQueue.process(async (job) => {
        console.log("processing nextComments queue");
        const {commentPage} = job.data;
        const fetchedComments = await fetchCommentsPage(ghClient, commentPage, {
            owner,
            name,
            PRs: {max: commentablesPageSize, comments: {max: commentsPageSize}},
            issues: {max: commentablesPageSize, comments: {max: commentsPageSize}},
        });

        fetchedComments.forEach((comment: Comment) =>
            pendingCommentsQueue.add("enqueue", {comment})
        );
    });
}

export async function upsertAll(context: Context, event: any) {
    console.log("upsertAll started");

    const pendingCommentablesQueue = new Queue("pendingCommentables");
    const pendingCommentsQueue = new Queue("pendingComments");

    // Process pendingCommentables queue
    pendingCommentablesQueue.process(async (job) => {
        console.log("processing pendingCommentables queue in upsertAll");
        const {commentable} = job.data;
        // TODO: Mutate commentables using Postgraphile
    });

    // Process pendingComments queue
    pendingCommentsQueue.process(async (job) => {
        console.log("processing pendingComments queue in upsertAll");
        const {comment} = job.data;
        await addCommentsToDatabase(context.pgClient, [comment]);
    });
}
