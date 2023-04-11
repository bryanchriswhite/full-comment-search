import {GraphQLClient} from "graphql-request";
import {
    Commentable,
    Comment,
    ResponseComment,
    ResponseIssue,
    ResponsePR,
    ResponseCommentable, CommentsPage, CommentablesPage
} from "../../lib/types/index.js";


// TODO: move
// interface CommentQueryArgs {
//     after: string;
//
// }

// TODO: consolidate w/ lib/types (?)
export interface Context {
    ghClient: GraphQLClient;
    pgClient: GraphQLClient;
    owner: string;
    name: string;
    fetchCommentablesQueue: CommentablesPage[];
    storeCommentablesQueue: Commentable[];
    fetchCommentsQueue: CommentsPage[];
    storeCommentsQueue: Comment[];
    // commentsQueue: CommentQueryArgs[];
};