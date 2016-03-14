import Rx from 'rx';
import CycleDOM from '@cycle/dom';
import isolate from '@cycle/isolate';
const { div, input, label } = CycleDOM;


function intent(DOMSource) {
    return DOMSource.select('.slider').events('input')
        .map(ev => ev.target.value);
}

function model(newValue$, props$) {
    const initialValue$ = props$.map(props => props.init).first();
    const value$ = initialValue$.concat(newValue$);
    return Rx.Observable.combineLatest(value$, props$, (value, props) => {
        return {
            label: props.label,
            unit: props.unit,
            min: props.min,
            max: props.max,
            value: value,
        };
    });
}

function view(state$) {
    return state$.map(state =>
        div('.labeled-slider', [
            label('.label', `${state.label}: ${state.value}${state.unit}`),
            input('.slider', {
                type: 'range',
                min: state.min,
                max: state.max,
                value: state.value,
            }),
        ])
    );
}

function LabeledSlider(sources) {
    const change$ = intent(sources.DOM);
    const state$ = model(change$, sources.props);
    const vtree$ = view(state$);
    return {
        DOM: vtree$,
        value: state$.map(state => state.value),
    };
}

export default function (sources) {
    return isolate(LabeledSlider)(sources);
}
