import {Commentable, Comment} from "../../lib/types/index.js";

export type Context = {
    commentablesQueue: Commentable[];
    commentsQueue: Comment[];
};
export type StateSchema = {
    states: {
        outdated: {};
        parallel: {
            states: {
                updatingCommentables: {};
                paginatingComments: {};
            };
        };
        updated: {};
    };
};
export type Event =
    | { type: 'FETCH_COMMENTABLES' }
    | { type: 'PAGINATE_COMMENTS' }
    | { type: 'RETRY_FETCH_COMMENTABLES' }
    | { type: 'COMMENTABLES_UPDATED' }
    | { type: 'UPDATE_ERROR' };