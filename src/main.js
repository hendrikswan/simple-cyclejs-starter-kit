import { Observable } from 'rx';
//  const { Observable } = Rx;
import Cycle from '@cycle/core';
import CycleDOM from '@cycle/dom';
const {
    makeDOMDriver,
    div,
} = CycleDOM;
// import auctionItem from './auctionItem';
import { navBar } from './navBar';
import { textEntry } from './messageBox';
import { contactList } from './contactList';
import { messageList } from './messageList';


function view(DOMSource) {
    const navBarView$ = navBar(DOMSource);

    // const chatPaneView$ = chatPane(DOMSource);
    // const presencePaneView$ = presencePane(DOMSource);
    const messageBox$ = textEntry(DOMSource);
    const contactList$ = contactList(DOMSource);
    const messageList$ = messageList(DOMSource);

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
                                messageBox$,
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
    const vtree$ = view(sources.DOM);

    return {
        DOM: vtree$,
    };
}

const drivers = {
    DOM: makeDOMDriver('#app'),
};


Cycle.run(main, drivers);
