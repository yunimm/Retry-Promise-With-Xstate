import { createMachine, assign } from 'xstate';
const MAX_RETRIES = 3;
export const machine = createMachine(
    {
        context: {
            retries: 0,
        },
        id: 'retryMachine',
        initial: 'idle',
        states: {
            idle: {
                on: {
                    START: [
                        {
                            target: 'trying',
                            actions: [],
                        },
                    ],
                },
            },
            trying: {
                invoke: {
                    input: {},
                    src: 'fetchData',
                    onDone: [
                        {
                            target: 'success',
                            actions: [],
                        },
                    ],
                    onError: [
                        {
                            target: 'retrying',
                            actions: [
                                {
                                    type: 'incrementRetries',
                                },
                            ],
                        },
                    ],
                },
            },
            success: {
                type: 'final',
            },
            retrying: {
                always: [
                    {
                        target: 'failed',
                        guard: 'retriesExceeded',
                        actions: [],
                    },
                    {
                        target: 'trying',
                        actions: [],
                    },
                ],
            },
            failed: {
                type: 'final',
            },
        },
    },
    {
        actions: {
            incrementRetries: assign({
                retries: (context) => context.retries + 1,
            }),
        },
        actors: {
            fetchData: () => {
                return new Promise((resolve, reject) => {
                    const isSuccess = Math.random() > 0.5;
                    setTimeout(() => {
                        isSuccess
                            ? resolve('Data fetched successfully')
                            : reject('Fetch error');
                    }, 1000);
                });
            },
        },
        guards: {
            retriesExceeded: (context) => context.retries >= MAX_RETRIES,
        },
        delays: {},
    },
);
