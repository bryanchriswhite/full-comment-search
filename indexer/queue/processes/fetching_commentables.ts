import Queue from "bull";
import {Commentable, Comment, CommentablesPage, CommentsPage} from "../../../lib/types";
import {Job} from "../../../lib/types/job";
import {fetchIssueComments} from "../../fetch";
import {GraphQLClient} from "graphql-request";

export default async function (job: Job<CommentablesPage>) {
    console.log("processing fetching commentables queue");

    const {ctx, commentablesPage,} = job;
    const {
        queryVars,
        queues: {fetching, storing},
        clientConfigs: {github},
    } = ctx;

    const fetchingCommentablesQueue = new Queue(storing.commentables),
        fetchingCommentsQueue = new Queue(fetching.comments),
        storingCommentablesQueue = new Queue(storing.commentables),
        storingCommentsQueue = new Queue(storing.comments)
    ;

    // GitHub GraphQL client
    const client = new GraphQLClient(github.endpointURL, {
        headers: {Authorization: `Bearer ${github.classicAccessToken}`},
    });

    // TODO: enqueue a page for each...
    // Fetch initial issues and issue comments
    const {commentables, comments, next} =
        await fetchIssueComments(client, queryVars);

    // Enqueue normalized commentables and comments
    commentables.forEach((commentable: Commentable) => {
        const job: Job<Commentable> = {ctx, commentable};
        storingCommentablesQueue.add("enqueue", job);
    });

    comments.forEach((comment: Comment) => {
        const job: Job<Comment> = {ctx, comment};
        storingCommentsQueue.add("enqueue", job);
    });

    // Enqueue CommentablePage and CommentPage objects to fetch next pages
    if (next.commentables) {
        const job: Job<CommentablesPage> = {ctx, nextPage: next.commentables};
        fetchingCommentablesQueue.add("enqueue", job);
    }

    if (next.comments) {
        next.comments.forEach((commentsPage: CommentsPage) => {
            const job: Job<CommentsPage> = {ctx, commentsPage};
            fetchingCommentsQueue.add("enqueue", job);
        });
    }
}
