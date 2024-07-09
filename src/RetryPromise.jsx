import React, { useState, useEffect } from 'react';
import { useMachine } from '@xstate/react';
import { createMachine, assign } from 'xstate';

const MAX_RETRIES = 3;

const fetchCuteAnimals = () => {
    // return fetch('https://www.reddit.com/r/aww.json')
    //     .then((res) => res.json())
    //     .then((data) => data.data.children.map((child) => child.data));
    // return Promise.reject();
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // reject('Fetch error');
            resolve('Fetch error');
        }, 3000); // 設置延遲時間為 3000 毫秒（3 秒）
    });
};

// const RETRY_STATES = {
//     IDLE: 'IDLE',
//     TRYING: 'TRYING',
//     SUCCESS: 'SUCCESS',
//     RETRYING: 'RETRYING',
//     FAILED: 'FAILED',
// };

// const RETRY_EVENTS = {
//     START: 'START',
//     INVOKE: 'INVOKE',
//     ALWAYS: 'ALWAYS',
// };

// const retryMachine = createMachine(
//     {
//         id: 'retryMachine',
//         initial: RETRY_STATES.IDLE,
//         context: {
//             retries: 0,
//         },
//         actors: {
//             fetchData: () => {
//                 console.log('work');
//                 // return new Promise((resolve, reject) => {
//                 //     const isSuccess = Math.random() > 0.5;
//                 //     setTimeout(() => {
//                 //         isSuccess
//                 //             ? resolve('Data fetched successfully')
//                 //             : reject('Fetch error');
//                 //     }, 1000);
//                 // });
//             },
//         },
//         states: {
//             [RETRY_STATES.IDLE]: {
//                 on: {
//                     [RETRY_EVENTS.START]: RETRY_STATES.TRYING,
//                 },
//             },
//             [RETRY_STATES.TRYING]: {
//                 // invoke: {
//                 //     src: 'fetchData',
//                 //     onDone: RETRY_STATES.SUCCESS,
//                 //     onError: {
//                 //         target: RETRY_STATES.RETRYING,
//                 //         actions: 'incrementRetries',
//                 //     },
//                 // },
//                 on: {
//                     [RETRY_EVENTS.TRYING]: RETRY_STATES.FAILED,
//                 },
//             },
//             [RETRY_STATES.SUCCESS]: {
//                 type: 'final',
//             },
//             [RETRY_STATES.RETRYING]: {
//                 always: [
//                     {
//                         target: RETRY_STATES.FAILED,
//                         guard: 'retriesExceeded',
//                     },
//                     {
//                         target: RETRY_STATES.TRYING,
//                     },
//                 ],
//             },
//             [RETRY_STATES.FAILED]: {
//                 type: 'final',
//             },
//         },
//     },
//     {
//         actions: {
//             incrementRetries: assign({
//                 retries: (context) => context.retries + 1,
//             }),
//         },
//         guards: {
//             retriesExceeded: (context) => context.retries >= MAX_RETRIES,
//         },
//     },
// );
const retryMachine = createMachine(
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
            // trying: {
            //     invoke: {
            //         input: {},
            //         id: 'fetchAnimals',
            //         src: fetchAnimals,
            //         onDone: [
            //             {
            //                 target: 'success',
            //                 actions: [],
            //             },
            //         ],
            //         onError: [
            //             {
            //                 target: 'retrying',
            //                 actions: [
            //                     {
            //                         type: 'incrementRetries',
            //                     },
            //                 ],
            //             },
            //         ],
            //     },
            // },
            trying: {
                invoke: {
                    id: 'fetchCuteAnimals',
                    src: fetchCuteAnimals,
                    onDone: {
                        target: 'success',
                        actions: [],
                    },
                    onError: {
                        target: 'failed',
                        actions: [{ type: 'incrementRetries' }],
                    },
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
                retries: (context) => Number(context.retries + 1),
            }),
        },
        // actors: {
        //     fetchData: () => {
        //         // console.log('1234 fetchData');
        //         return new Promise((resolve, reject) => {
        //             const isSuccess = Math.random() > 0.5;
        //             setTimeout(() => {
        //                 isSuccess
        //                     ? resolve('Data fetched successfully')
        //                     : reject('Fetch error');
        //             }, 1000);
        //         });
        //     },
        // },
        services: {
            fetchData: () => {
                console.log('fetchData function invoked');
                return new Promise((resolve, reject) => {
                    const isSuccess = Math.random() > 0.5;
                    setTimeout(() => {
                        isSuccess
                            ? resolve('Data fetched successfully')
                            : reject('Fetch error');
                    }, 1000);
                });
            },
            aa: () => {
                console.log('a');
            },
        },
        guards: {
            retriesExceeded: (context) => context.retries >= MAX_RETRIES,
        },
        delays: {},
    },
);

function RetryPromise() {
    const [state, send] = useMachine(retryMachine);
    const [result, setResult] = useState(null);

    console.log({ state, send });

    const handleStart = () => {
        console.log('START event sent');
        send({ type: 'START' });
        console.log('START event sent2');
    };

    React.useEffect(() => {
        if (state.matches('SUCCESS')) {
            setResult('Data fetched successfully');
        } else if (state.matches('FAILED')) {
            setResult('Failed: Maximum retries exceeded');
        }
    }, [state]);

    return (
        <div>
            <h1>Retry Machine</h1>
            <p>Current State: {state.value}</p>
            <p>Retries: {state.context.retries}</p>
            {result && <p>{result}</p>}
            {state.matches('idle') && (
                <button onClick={handleStart}>Start</button>
            )}
            {state.matches('trying') && <p>Trying to fetch data...</p>}
        </div>
    );
}

export default RetryPromise;
