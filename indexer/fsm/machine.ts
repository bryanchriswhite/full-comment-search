import {createMachine} from "xstate";
import {
    queueAll,
    upsertAll,
    logError,
    logUpdated
} from "./services.js";
import {Context} from "./types.js";
import {GraphQLClient} from "graphql-request";

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
                        queuing: {
                            initial: 'queuing',
                            states: {
                                queuing: {
                                    invoke: {
                                        src: async function (c: Context, e: any) {
                                            console.log("post queueAll invoke");
                                            e.data.machine.send("queuingComplete")
                                        },
                                        onDone: "queuingComplete",
                                    },
                                },
                                queuingComplete: {
                                    type: "final",
                                    invoke: {
                                        src: async function (c: Context, e: any) {
                                            console.log("queuingComplete state");
                                        }
                                    }
                                },

                            }
                        },
                        upserting: {
                            initial: 'upserting',
                            states: {
                                upserting: {
                                    invoke: {
                                        src: "upsertAll",
                                        onDone: "upsertingComplete",
                                        // onError: ?,
                                    },
                                },
                                upsertingComplete: {
                                    type: "final",
                                },
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