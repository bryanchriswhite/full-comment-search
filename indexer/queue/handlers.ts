import {GraphQLClient} from 'graphql-request';
import {addCommentsToDatabase} from '../store';
import {fetchIssueComments, fetchCommentsPage} from '../fetch';
import {Commentable, Comment} from "../../lib/types";
import {Context} from "../fsm/types";

export function processPendingCommentablesFactory(ctx: Context) {
    return async function (job: any) {
        const {commentable} = job.data;
        console.log("Processing pending commentable:", commentable);
        // TODO: Mutate commentables using Postgraphile
    };
}

export function processPendingCommentsFactory(ctx: Context) {
    return async function (job: any) {
        const {comment} = job.data;
        console.log("Processing pending comment:", comment);
        await addCommentsToDatabase(ctx.pgClient, [comment]);
    };
}

export function processNextCommentablesFactory(ctx: Context) {
    return async function (job: any) {
        const {nextPage} = job.data;
        console.log("Processing next commentables page:", nextPage);
        const {commentables: nextCommentables, comments: nextComments} =
            await fetchIssueComments(ctx.ghClient, {
                owner: ctx.owner,
                name: ctx.name,
                PRs: {
                    max: ctx.commentablesPageSize,
                    comments: {max: ctx.commentsPageSize},
                },
                issues: {
                    max: ctx.commentablesPageSize,
                    comments: {max: ctx.commentsPageSize},
                },
                ...nextPage,
            });

        nextCommentables.forEach((commentable: Commentable) => {
            console.log("Enqueueing next commentable:", commentable);
            ctx.pendingCommentablesQueue.add('enqueue', {commentable});
        });

        nextComments.forEach((comment: Comment) => {
            console.log("Enqueueing next comment:", comment);
            ctx.pendingCommentsQueue.add('enqueue', {comment});
        });
    };
}

export function processNextCommentsFactory(ctx: Context) {
    return async function (job: any) {
        const {commentPage} = job.data;
        console.log("Processing next comments page:", commentPage);
        const fetchedComments = await fetchCommentsPage(ctx.ghClient, commentPage, {
            owner: ctx.owner,
            name: ctx.name,
            PRs: {
                max: ctx.commentablesPageSize,
                comments: {max: ctx.commentsPageSize},
            },
            issues: {
                max: ctx.commentablesPageSize,
                comments: {max: ctx.commentsPageSize},
            },
        });

        fetchedComments.forEach((comment: Comment) => {
            console.log("Enqueueing fetched comment:", comment);
            ctx.pendingCommentsQueue.add('enqueue', {comment});
        });
    };
}
