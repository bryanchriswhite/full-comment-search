import {Commentable, Comment} from "../../lib/types/index.js";
import {GraphQLClient} from "graphql-request";

export interface Context {
    gqlClient: GraphQLClient;
    commentablesQueue: Commentable[];
    commentsQueue: Comment[];
};