import {interpret} from 'xstate';
import {createMachine} from 'xstate';

describe('Parallel state machine', () => {
    const parallelMachine = createMachine({
        id: 'parallelMachine',
        predictableActionArguments: true,
        initial: "one",
        states: {
            one: {
                type: 'parallel',
                onDone: 'finished',
                states: {
                    A: {
                        initial: 'idle',
                        states: {
                            // idle: {on: {START: 'active'}},
                            // active: {type: "final"}
                            idle: {
                                invoke: {
                                    src: async (c, e) => {
                                        console.log("one.A.idle state");
                                        await new Promise<void>(resolve => {
                                            setTimeout(() => {
                                                console.log("delay one.A.idle")
                                                resolve();
                                            }, 1000)
                                        });
                                    },
                                    onDone: {
                                        target: "active",
                                        actions: ["aDone"]
                                    }
                                },
                            },
                            active: {
                                type: "final",
                                invoke: {
                                    src: async (c, e) => {
                                        console.log("one.A.active state");
                                    }
                                },
                            }
                        }
                    },
                    B: {
                        initial: 'waiting',
                        states: {
                            waiting: {on: {GO: 'moving'}},
                            moving: {
                                type: "final",
                                invoke: {
                                    src: async (c, e) => {
                                        console.log("one.B.moving state");
                                    }
                                }
                            }
                        }
                    },
                },
            },
            finished: {
                type: "final",
                invoke: {
                    src: async (c, e) => {
                        console.log("finished state!")
                    }
                }
            }
        },
    }, {
        actions: {
            aDone: (c, e) => {
                console.log("aDone action");
            }
        }
    });

    it('should transition to the final state after the parallel states have completed', (done) => {
        const service = interpret(parallelMachine).onDone(() => {
            expect(service.state.value).toBe('finished');
            console.log("HELLO!")
            done();
        });

        service.start();
        // service.send({ type: 'START', to: 'A' });
        service.send({type: 'GO', to: 'B'});
        setTimeout(() => {
            console.log("delay test");
        }, 1200)
    });
});
