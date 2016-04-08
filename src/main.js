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
import Immutable from 'immutable';


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

function intent({ messageBox }) {
    const messageAdded$ = messageBox.value$;

    return {
        messageAdded$,
    };
}


function makeStateStoreDriver(initialState = {}) {
    return (input$) => {
        // We convert it to immutable state
        const immutableState = Immutable.fromJS(initialState);
        // We scan over any state changes. These state changes
        // are functions where we pass in existing state and get
        // new state back
        return input$.scan((state, changeState) => {
            return changeState(state);
        }, immutableState)
        // To fire up the app we need to pass the initial state
        .startWith(immutableState);
    };
}


function main({ HTTP, DOM, store }) {
    const messageAdded$ = new Rx.ReplaySubject(1);

    const messageHTTP = MessageHTTP({
        HTTP: HTTP,
        props: {
            messageAdded$,
        },
    });


    // We create a state change based on DOM input
    const messageUpdate$ = messageHTTP.response$
        // We map to a function that receives the value from the observable
        // and returns a function: (state) => state.set('inputValue', value)
        .map(value => state => {
            // state.messages = value;
            // console.log('updating state!: ', state);
            const updatedState = state.set('messages', value);
            return updatedState;
        });


    const navBar = NavBar();
    const contactList = ContactList();

    // store.subscribe(state => console.log(state.get('messages')));
    const messageList = MessageList({
        props: {
            messages$: store.map(state => state.toJS().messages),  // store.map(s => s.messages),
        },
    });
    const messageBox = MessageBox({ DOM });


    const actions = intent({ messageBox });

    const vtree$ =
        view({ messageBox, messageList, navBar, contactList });


    // cyclic dependency stuff
    actions.messageAdded$.subscribe(messageAdded$);

    return {
        DOM: vtree$,
        HTTP: messageHTTP.request$,
        store: messageUpdate$,
    };
}

const drivers = {
    DOM: makeDOMDriver('#app'),
    HTTP: makeHTTPDriver(),
    store: makeStateStoreDriver({
        messages: [],
    }),
};


Cycle.run(main, drivers);
