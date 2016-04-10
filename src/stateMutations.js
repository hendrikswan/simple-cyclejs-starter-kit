import constants from './constants';
import { Observable as $ } from 'rx';

export default function ({ actions }) {
    const channelPollResult$ = actions
        .filter(a => a.type === constants.CHANNEL_POLL_RESULT)
        .map(a => a.value)
        .map(value => state => {
            // state.messages = value;
            // console.log('updating state!: ', state);
            const updatedState = state.set('channels', value);
            return updatedState;
            // return state;
        });

    const messagePollResult$ = actions
        .filter(a => a.type === constants.MESSAGES_POLL_RESULT)
        .map(a => a.value)
        .map(value => state => {
            // state.messages = value;
            // console.log('updating state!: ', state);
            const updatedState = state.set('messages', value);
            return updatedState;
            // return state;
        });

    return $.merge(messagePollResult$, channelPollResult$);
}
