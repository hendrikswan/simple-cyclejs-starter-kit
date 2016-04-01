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
import { textEntry } from './messageBox';
import { contactList } from './contactList';
import { messageList } from './messageList';


function view(DOMSource, messages) {
    const navBarView$ = navBar(DOMSource);

    // const chatPaneView$ = chatPane(DOMSource);
    // const presencePaneView$ = presencePane(DOMSource);
    const messageBox$ = textEntry(DOMSource);
    const contactList$ = contactList(DOMSource);
    const messageList$ = messageList(DOMSource, messages);

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
                                messageList$,
                                div({ style: { 'padding-top': '20px' } }, [
                                    messageBox$,
                                ]),
                            ]),
                        ]),
                    ]),
                ]),
            ]),
        ])
    );

    // return vtree$;

    return vtree$;
}

function main(sources) {
    // const vtree$ = view(sources.DOM);

    const request$ = Observable
        .interval(1000)
        .map(() => {
            return {
                url: 'http://localhost:3000/messages',
                category: 'messagePoll',
            };
        });

    const vtree$ = sources.HTTP
        .filter(res$ => res$.request.category === 'messagePoll')
        .flatMap(x => x)
        .map(res => res.body)
        .startWith([])
        .map(messages => view(sources.DOM, messages));

    return {
        DOM: vtree$,
        HTTP: request$,
    };
}

const drivers = {
    DOM: makeDOMDriver('#app'),
    HTTP: makeHTTPDriver(),
};


Cycle.run(main, drivers);
