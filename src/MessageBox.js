import { Observable as $ } from 'rx';
import { div, input, label, a, i } from '@cycle/dom';

function intent({ DOM }) {
    const textStream$ = DOM
        .select('#input-msg')
        .events('keyup')
        .map(e => e.target.value)
        .filter(msg => msg.length > 0);

    const buttonClick$ = DOM.select('#send-btn').events('click').map(e => e.target);
    const text$ = buttonClick$.withLatestFrom(textStream$, (buttonClick, textStream) => {
        return textStream;
    });

    return text$.share().startWith(null);
}

export default function MessageBox({ DOM, store }) {
    const value$ = intent({ DOM });

    const vtree$ = value$.withLatestFrom(store, (value, state) => {
        return div({ className: 'row' }, [
            div({ className: 'input-field col s10' }, [
                input({
                    id: 'input-msg',
                    disabled: state.get('sending_new_msg'),
                    className: 'validate',
                    autofocus: true,
                    value: '',
                }),
                label({ className: 'active' }, 'Type your chat, enter or hit button to send'),
            ]),
            div({ className: 'input-field col s2' }, [
                a({ id: 'send-btn', className: 'btn-floating btn-large waves-effect waves-light red' }, [
                    i({ className: 'material-icons' }, 'send'),
                ]),
            ]),
        ]);
    });

    return {
        DOM: vtree$,
        value$,
    };
}
