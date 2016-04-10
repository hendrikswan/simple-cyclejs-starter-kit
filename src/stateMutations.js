import constants from './constants';
import { Observable as $ } from 'rx';

export default function ({ actions }) {
    const channelPollResult$ = actions
        .filter(a => a.type === constants.CHANNEL_POLL_RESULT)
        .map(a => a.value)
        .map(value => state => state.set('channels', value));

    const messagePollResult$ = actions
        .filter(a => a.type === constants.MESSAGES_POLL_RESULT)
        .map(a => a.value)
        .map(value => state => state.set('messages', value));

    const messageAddStart$ = actions
        .filter(a => a.type === constants.NEW_MESSAGE_ADDED)
        .map(() => state => state.set('sending_new_msg', true));

    const messageAddCompleted$ = actions
        .filter(a => a.type === constants.NEW_MESSAGE_ADD_COMPLETED)
        .map(() => state => state.set('sending_new_msg', false));

    return $.merge(
        messagePollResult$,
        channelPollResult$,
        messageAddStart$,
        messageAddCompleted$
    );
}
