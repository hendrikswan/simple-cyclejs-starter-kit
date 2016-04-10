import Immutable from 'immutable';

export default function makeStateDriver(initialState = {}) {
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
