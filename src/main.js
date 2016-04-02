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
import NavBar from './NavBar';
import MessageBox from './MessageBox';
import ContactList from './ContactList';
import MessageList from './MessageList';


function view({ messageBox, messageList, navBar, contactList }) {
    const vtree$ = Observable.of(
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

function main(sources) {
    const messagePollRequest$ = Observable
        .interval(1000)
        .map(() => {
            return {
                url: 'http://localhost:3000/messages',
                category: 'messagePoll',
            };
        });

    const messages$ = sources.HTTP
        .filter(res$ => res$.request.category === 'messagePoll')
        .flatMap(x => x)
        .map(res => res.body)
        .startWith([]);


    const navBar = NavBar(sources);
    const contactList = ContactList(sources);
    const messageList = MessageList(Object.assign({}, sources, {
        prop$: {
            messages$,
        },
    }));

    const messageBox = MessageBox(sources);
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
    const vtree$ = view({ sources, messageBox, messageList, navBar, contactList });

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
