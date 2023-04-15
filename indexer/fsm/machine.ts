import {GraphQLClient} from "graphql-request";
import {createMachine} from "xstate";
import {
    queueAll,
    upsertAll,
    logError,
    logUpdated
} from "./services.js";
import {Context} from "./types.js";

// TODO: decompose into multiple machines
export function newUpdateMachine(context: Context) {
    return createMachine<Context>(
        {
            id: "comments",
            initial: "outdated",
            predictableActionArguments: true,
            context,
            states: {
                outdated: {
                    on: {
                        UPDATE: "updating",
                    },
                },
                updating: {
                    type: "parallel",
                    onDone: "updated",
                    states: {
                        fetching: {
                            initial: 'start',
                            states: {
                                start: {
                                    invoke: {
                                        src: "queueAll",
                                        onDone: "done",
                                        // onError: ?,
                                    },
                                },
                                done: {type: "final"},

                            }
                        },
                        storing: {
                            initial: 'start',
                            states: {
                                start: {
                                    invoke: {
                                        src: "upsertAll",
                                        onDone: "done",
                                        // onError: ?,
                                    },
                                },
                                done: {type: "final"},
                            },
                        },
                    },
                },
                updated: {
                    type: "final",
                    invoke: {src: "logUpdated"}
                },
            },
        },
        {
            services: {
                queueAll: queueAll,
                upsertAll: upsertAll,
                logError: logError,
                // TODO: remove
                logUpdated: logUpdated,
            },
        },
    );
}

export default newUpdateMachine;