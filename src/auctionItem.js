import Rx from 'rx';
import CycleDOM from '@cycle/dom';
import isolate from '@cycle/isolate';
const { div } = CycleDOM;


function intent(DOMSource) {
    return DOMSource.select('.auction-title').events('click')
        .map(ev => {
            return {
                amount: ev.target.amount,
                increment: 1,
            };
        });
}

function model(newValue$, props$) {
    const initialValue$ = props$.map(props => props.init).first();
    const value$ = initialValue$.concat(newValue$);
    return Rx.Observable.combineLatest(value$, props$, (value, props) => {
        let amount = props.amount;
        if (value) {
            amount = value.amount + value.increment;
        }
        return {
            title: props.title,
            amount,
        };
    });
}

function view(state$) {
    return state$.map(state =>
        div('.auction-item', [
            div('.auction-title', { amount: state.amount }, [state.title]),
            div('.auction-amount', [state.amount]),
        ])
    );
}

function auctionItem(sources) {
    // const defaultProps$ = Rx.Observable.of({
    //     title: 'An old car',
    //     amount: 500,
    // });

    const change$ = intent(sources.DOM);
    const state$ = model(change$, sources.props);
    const vtree$ = view(state$);
    return {
        DOM: vtree$,
        value: state$.map(state => state.value),
    };
}

export default function (sources) {
    return isolate(auctionItem)(sources);
}
