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
                                    invoke: [
                                        {
                                            src: "queueAll",
                                            // onError: ?,
                                        },
                                    ],
                                    // onDone: "complete",

                                },
                                complete: {
                                    // type: "final",
                                    invoke: {
                                        src: async (context: Context, event: any) => {
                                            console.log("queueing complete state");
                                        }
                                    }
                                },

                            }
                        },
                        upserting: {
                            initial: 'upserting',
                            states: {
                                upserting: {
                                    invoke: [
                                        {
                                            src: "upsertAll",
                                            // onError: ?,
                                        },
                                    ],
                                    // onDone: "complete",
                                },
                                complete: {
                                    // type: "final",
                                    invoke: {
                                        src: async (context: Context, event: any) => {
                                            console.log("upserting complete state")
                                        }
                                    }
                                },
                            },
                        },
                        udpated: {
                            // type: "final"
                            invoke: {
                                src: async (context: Context, event: any) => {
                                    console.log("nested updated state")
                                }
                            }
                        }
                    },
                },
                updated: {
                    // type: "final",
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