import { interpret } from 'xstate';
import { createMachine } from 'xstate';

describe('Parallel state machine', () => {
    const parallelMachine = createMachine({
        id: 'parallelMachine',
        type: 'parallel',
        states: {
            A: {
                initial: 'idle',
                states: {
                    idle: { on: { START: 'active' } },
                    active: { on: { STOP: 'idle' } }
                }
            },
            B: {
                initial: 'waiting',
                states: {
                    waiting: { on: { GO: 'moving' } },
                    moving: { on: { STOP: 'waiting' } }
                }
            }
        },
        onDone: 'finished'
    });

    it('should transition to the final state after the parallel states have completed', (done) => {
        const service = interpret(parallelMachine).onDone(() => {
            expect(service.state.value).toBe('finished');
            done();
        });

        service.start();
        service.send('START', { to: 'A' });
        service.send('GO', { to: 'B' });
        service.send('STOP', { to: 'A' });
        service.send('STOP', { to: 'B' });
    });
});
