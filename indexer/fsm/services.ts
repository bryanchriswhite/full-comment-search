import {Comment, Commentable, CommentablesPage, CommentableType, CommentsPage} from "../../lib/types/index.ts";
import {Context} from "../../lib/types/indexer";
import {Job} from "../../lib/types/job";

export async function logUpdated(ctx: Context, event: any) {
    console.log("updated state!");
}

export async function logError(ctx: Context, event: any) {
    // TODO:
}

export async function queueAll(ctx: Context, event: any) {
    const {queues: {fetching, storing}} = ctx;

    // TODO: move?
    const firstIssuePage = {commentableType: CommentableType.ISSUE,};
    const firstIssueJob: Job<CommentablesPage> = {ctx, nextPage: firstIssuePage};
    fetching.commentables.add("enqueue", firstIssueJob);

    // TODO: PRs and  reviews...



    const {commentables, comments} = ctx.processes.fetching;

    // Kick-off fetching commentables queue processing (dequeuing)
    fetching.commentables.process(
        commentables.concurrency,
        commentables.scriptPath,
    );

    // Kick-off fetching comments queue processing (dequeuing)
    fetching.comments.process(
        comments.concurrency,
        comments.scriptPath,
    );
}

export async function upsertAll(ctx: Context, event: any) {

    // const {endpointURL} = ctx.gqlClientConfigs.postgraphile;
    const {commentables, comments} = ctx.processes.storing;

    // TODO: add authentication
    // postgraphile graphql client
    // const client = new GraphQLClient(endpointURL);

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
