import React from 'react';
import { useMachine } from '@xstate/react';
import { createMachine } from 'xstate';

import './style.css';
import { RedLight, GreenLight, YellowLight } from './Light';
const LIGHT_STATES = {
    RED: 'RED',
    GREEN: 'GREEN',
    YELLOW: 'YELLOW',
};

const LIGHT_EVENTS = {
    CLICK: 'CLICK',
};

const lightMachine = createMachine({
    initial: LIGHT_STATES.RED,
    states: {
        [LIGHT_STATES.RED]: {
            on: {
                [LIGHT_EVENTS.CLICK]: LIGHT_STATES.GREEN,
            },
        },
        [LIGHT_STATES.GREEN]: {
            on: {
                [LIGHT_EVENTS.CLICK]: LIGHT_STATES.YELLOW,
            },
        },
        [LIGHT_STATES.YELLOW]: {
            on: {
                [LIGHT_EVENTS.CLICK]: LIGHT_STATES.RED,
            },
        },
    },
});

function RGB() {
    const [state, send] = useMachine(lightMachine);
    return (
        <div className="rgb">
            {state.matches(LIGHT_STATES.RED) && <RedLight />}
            {state.matches(LIGHT_STATES.GREEN) && <GreenLight />}
            {state.matches(LIGHT_STATES.YELLOW) && <YellowLight />}
            <button
                onClick={() => {
                    send({ type: LIGHT_EVENTS.CLICK });
                }}
            >
                click me
            </button>
        </div>
    );
}

export default RGB;
