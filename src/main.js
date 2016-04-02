import { Observable } from 'rx';
//  const { Observable } = Rx;
import Cycle from '@cycle/core';
import CycleDOM from '@cycle/dom';
const {
    makeDOMDriver,
    div,
} = CycleDOM;
import { makeHTTPDriver } from '@cycle/http';

// import auctionItem from './auctionItem';
import { navBar } from './navBar';
import MessageBox from './MessageBox';
import { contactList } from './contactList';
import MessageList from './MessageList';


function view({ sources, messageBox, messageList }) {
    const navBarView$ = navBar(sources);

    // const chatPaneView$ = chatPane(DOMSource);
    // const presencePaneView$ = presencePane(DOMSource);

    const contactList$ = contactList(sources);
    const vtree$ = Observable.of(
        div([
            navBarView$,
            div({ className: 'container', style: { 'padding-top': '40px' } }, [
                div({ className: 'row' }, [
                    div({ className: 'col s3' }, [
                        div({ className: 'card' }, [
                            div({ className: 'card-content' }, [
                                contactList$,
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

function main(sources) {
    const messagePollRequest$ = Observable
        .interval(1000)
        .map(() => {
            return {
                url: 'http://localhost:3000/messages',
                category: 'messagePoll',
            };
        });


    const messageBox = MessageBox(sources);
    const messageList = MessageList(sources);
    const text$ = messageBox.value$;

    const messagePostRequest$ = text$
        .map(msg => ({
            url: 'http://localhost:3000/messages',
            category: 'messagePost',
            method: 'POST',
            send: {
                text: msg,
            },
            eager: true,
        }));

    const requestStream$ = Observable.merge(messagePollRequest$, messagePostRequest$);
    const vtree$ = view({ sources, messageBox, messageList });

    return {
        DOM: vtree$,
        HTTP: requestStream$,
    };
}

const drivers = {
    DOM: makeDOMDriver('#app'),
    HTTP: makeHTTPDriver(),
};


Cycle.run(main, drivers);
