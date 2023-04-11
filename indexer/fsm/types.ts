import {Commentable, Comment} from "../../lib/types";
import {GraphQLClient} from "graphql-request";

export interface Context {
    gqlClient: GraphQLClient;
    owner: string;
    name: string;
    commentablesQueue: Commentable[];
    commentsQueue: Comment[];
};