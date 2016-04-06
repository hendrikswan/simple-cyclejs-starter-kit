import Rx, { Observable } from 'rx';
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


// function model(actions) {
//     const messagePollRequest$ = Observable
//         .interval(1000)
//         .map(() => {
//             return {
//                 url: 'http://localhost:3000/messages',
//                 category: 'messagePoll',
//             };
//         });
//
//     const messagePostRequest$ = actions.messagedAdded$
//         .map(msg => ({
//             url: 'http://localhost:3000/messages',
//             category: 'messagePost',
//             method: 'POST',
//             send: {
//                 text: msg,
//             },
//             eager: true,
//         }));
//
//     const requestStream$ = Observable.merge(messagePollRequest$, messagePostRequest$);
//
//     return {
//         requestStream$,
//     };
// }


// find a way to get all components $value streams
// and map over them, to identify them (actions)
// can even validate that actions are being fired that aren't available in a constants file or something...
// basically harvest all intents from all components, merge them in a way that's identifiable ..
function intent({ messageBox }) {
    const messageAdded$ = messageBox.value$;

    return {
        messageAdded$,
    };
}


function main(sources) {
    // * a way to break up components - components can be dom components, or http components, or etc components
    // never mix, because then it becomes more difficult to figure out what's going on, and to change stuff like http interaction
    // * a sequence for pulling in components, first HTTP, then DOM components,  then MVI
    // * annotations used to validate input streams and combine them? , of functions wat jy call


    // so die component return dalk:
    // function Component () {
    //     return {
    //         DOM,
    //         value: {
    //             textSubmitted$: {
    //                 description: 'contains a bunch of stuff',
    //                 id: 'text_submitted',
    //             },
    //             textChanged$: {
    //                 description: 'the text element was updated',
    //                 id: 'text_changed',
    //             },
    //         },
    //     };
    // }


    // en dan call mens dit iets soos hierdie
    // const component = circularize(Component);
    // component.DOM
    // component.value
    //
    // Dan kan ek hierdie component in intent inpass, en intent kan dan oor die goeters iterate en self
    // validate dat die goeters wat hy expect exhibit word op die value wat hy mee werk, die goed
    // wat hy expect


    // hierdie is die probleem: want ek moet laat messagelist access het hierna
    // en die ander ding is dat ek kan ook nie die components in die view create nie
    // want die intent van message add kom vanaf die messageBox
    // m.a.w: een component (messageBox) moet create word voor intent, die ander (messageList) na model, en intent is input na model


    //  (poll response)         messages$ ----------------------------------
    // (messageBox.value$) messagedAdded$ ----------------------------------
    // relies on components        vtree$ ----------------------------------

    // const proxyTextFilterSinks = {value$: new Rx.Subject()};
    // const actions = intent(proxyTextFilterSinks);
    // const state$ = model(peoplePageHTTP.response$, sources.props$, actions);
    // const textFilter = TextFilterWrapper(state$, sources.DOM);
    // replicateStream(textFilter.value$, proxyTextFilterSinks.value$);
    const messageAdded$ = new Rx.ReplaySubject(1);

    const messageHTTP = MessageHTTP({
        HTTP: sources.HTTP,
        props: {
            messageAdded$,
        },
        // I don't want props to be obserable,
        // but rather contains all the observables needed by
        // this HTTP component

        // need to find a way to easily do prop validation
    });

    const navBar = NavBar(sources);
    const contactList = ContactList(sources);
    const messageList = MessageList(Object.assign({}, sources, {
        props: {
            messages$: messageHTTP.response$,
        },
    }));
    const messageBox = MessageBox(sources);


    const actions = intent({ messageBox });
    const vtree$ = view({ messageBox, messageList, navBar, contactList });

    // cyclic dependency stuff
    actions.messageAdded$.subscribe(messageAdded$);

    return {
        DOM: vtree$,
        HTTP: messageHTTP.request$,
    };
}

const drivers = {
    DOM: makeDOMDriver('#app'),
    HTTP: makeHTTPDriver(),
};


Cycle.run(main, drivers);
