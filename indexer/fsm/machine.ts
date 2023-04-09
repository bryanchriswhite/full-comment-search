import {createMachine} from "xstate";
import {fetchCommentables, paginateComments} from "./services.js";
import {Context} from "./types.js";

const commentableMachine = createMachine<Context>(
    {
        id: 'commentable',
        initial: 'outdated',
        context: {
            commentablesQueue: [],
            commentsQueue: [],
        },
        states: {
            outdated: {
                on: {
                    FETCH_COMMENTABLES: 'parallel',
                },
            },
            parallel: {
                type: 'parallel',
                states: {
                    updatingCommentables: {
                        invoke: {
                            src: 'fetchCommentables',
                            onError: 'UPDATE_ERROR',
                        },
                    },
                    paginatingComments: {
                        invoke: {
                            src: 'paginateComments',
                            onError: 'UPDATE_ERROR',
                        },
                    },
                },
                on: {
                    COMMENTABLES_UPDATED: 'updated',
                },
            },
            updated: {
                on: {
                    FETCH_COMMENTABLES: 'parallel',
                    PAGINATE_COMMENTS: 'parallel',
                },
            },
        },
    },
    {
        services: {
            fetchCommentables: fetchCommentables,
            paginateComments: paginateComments,
        },
    },
);

export default commentableMachine