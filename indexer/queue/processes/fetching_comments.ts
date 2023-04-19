import Queue from "bull";
import {Commentable, Comment, CommentablesPage, CommentsPage, QueryVars} from "../../../lib/types";
import {Job} from "../../../lib/types/job";
import {fetchIssueComments} from "../../fetch";
import {GraphQLClient} from "graphql-request";

export default async function (job: Job<CommentsPage>) {
    console.log("processing fetching comments queue");

    const {ctx, commentsPage,} = job;
    const {
        queryVars,
        queues: {fetching, storing},
        clientConfigs: {github},
    } = ctx;

    const fetchingCommentsQueue = new Queue(fetching.comments),
        storingCommentsQueue = new Queue(storing.comments)
    ;

    // GitHub GraphQL client
    const client = new GraphQLClient(github.endpointURL, {
        headers: {Authorization: `Bearer ${github.classicAccessToken}`},
    });

    // TODO: refactor
    const {owner, name, pageSize} = queryVars;
    const nextCommentPageVars: QueryVars = {
        owner, name,
        pageSize: {
            commentables: 1,
            comments: pageSize.comments,
        },
        pageVars: queryVars.pageVars ?? {},
    };

    // TODO: enqueue a page for each...
    // Fetch initial issues and issue comments
    const {comments, next} =
        await fetchIssueComments(client, nextCommentPageVars);

    comments.forEach((comment: Comment) => {
        const job: Job<Comment> = {ctx, comment};
        storingCommentsQueue.add("enqueue", job);
    });

    // Enqueue `CommentPage` object to fetch next page
    if (next.comments) {
        next.comments.forEach((commentsPage: CommentsPage) => {
            const job: Job<CommentsPage> = {ctx, commentsPage};
            fetchingCommentsQueue.add("enqueue", job);
        });
    }
}
