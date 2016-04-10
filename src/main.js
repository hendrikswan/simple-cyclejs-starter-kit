import { Observable as $ } from 'rx';
import Cycle from '@cycle/core';
import CycleDOM from '@cycle/dom';
const {
    makeDOMDriver,
    div,
} = CycleDOM;
import { makeHTTPDriver } from '@cycle/http';
import MessageHTTP from './MessageHTTP';

// import auctionItem from './auctionItem';
import NavBar from './NavBar';
import MessageBox from './MessageBox';
import ChannelList from './ChannelList';
import MessageList from './MessageList';
import makeStateDriver from './makeStateDriver';
import makeActionDriver from './makeActionDriver';
import constants from './constants';
import stateMutations from './stateMutations';


function view({ messageBox, messageList, navBar, contactList }) {
    const vtree$ = $.of(
        div([
            navBar.DOM,
            div({ className: 'container', style: { 'padding-top': '40px' } }, [
                div({ className: 'row' }, [
                    div({ className: 'col s3' }, [
                        div({ className: 'card' }, [
                            div({ className: 'card-content' }, [
                                contactList.DOM,
                            ]),
                        ]),
                    ]),
                    div({ className: 'col s9' }, [
                        div({ className: 'card' }, [
                            div({ className: 'card-content' }, [
                                messageList.DOM,
                                div({ style: { 'padding-top': '20px' } }, [
                                    messageBox.DOM,
                                ]),
                            ]),
                        ]),
                    ]),
                ]),
            ]),
        ])
    );

    return vtree$;
}

function main({ HTTP, DOM, store, actions }) {
    const messageAdded$ = actions
        .filter(a => a.type === constants.NEW_MESSAGE_ADDED)
        .map(a => a.value);

    const messageHTTP = MessageHTTP({
        HTTP: HTTP,
        props: {
            messageAdded$,
        },
    });

    stateMutations({ store, actions });

    const navBar = NavBar();
    const contactList = ChannelList({
        props: {
            channel$: store.map(state => state.toJS().channels),
        },
    });
    // store.subscribe(state => console.log(state.get('messages')));
    const messageList = MessageList({
        props: {
            messages$: store.map(state => state.toJS().messages),  // store.map(s => s.messages),
        },
    });
    const messageBox = MessageBox({ DOM, store });


    // We create a state change based on DOM input
    const messagePollResultAction$ = messageHTTP.messagePollResponse$
        .map(value => ({
            type: constants.MESSAGES_POLL_RESULT,
            value,
        }));
        // We map to a function that receives the value from the observable
        // and returns a function: (state) => state.set('inputValue', value)

    const channelPollResultAction$ = messageHTTP.channelPollResponse$
        .map(value => ({
            type: constants.CHANNEL_POLL_RESULT,
            value,
        }));

    const messagePostResponseAction$ = messageHTTP.messagePostResponse$
        .map(() => ({
            type: constants.NEW_MESSAGE_ADD_COMPLETED,
        }));


    const newMessageAction$ = messageBox.value$.map(value => ({
        type: constants.NEW_MESSAGE_ADDED,
        value,
    }));

    const vtree$ =
        view({ messageBox, messageList, navBar, contactList });

    return {
        DOM: vtree$,
        HTTP: messageHTTP.request$,
        actions: $.merge(newMessageAction$,
            channelPollResultAction$,
            messagePollResultAction$,
            messagePostResponseAction$
        ),
        store: stateMutations({ actions }),
    };
}

const drivers = {
    DOM: makeDOMDriver('#app'),
    HTTP: makeHTTPDriver(),
    store: makeStateDriver({
        messages: [],
        channels: [],
    }),
    actions: makeActionDriver(),
};


Cycle.run(main, drivers);
