import { Observable } from 'rx';
import { div, input, label, a, i } from '@cycle/dom';

function intent(sources) {
    const { DOM } = sources;
    const textStream$ = DOM.select('#input-msg').events('keyup').map(e => e.target);
    const buttonClick$ = DOM.select('#send-btn').events('click').map(e => e.target);
    const text$ = buttonClick$.withLatestFrom(textStream$, (buttonClick, textStream) => {
        return textStream;
    })
    .map(textInput => textInput.value)
    .filter(msg => msg.length > 0);

    return text$.share();
}

export default function MessageBox(sources) {
    const value$ = intent(sources);

    const vtree$ = value$
        .startWith(null)
        .map(() => {
            return Observable.of(
                div({ className: 'row' }, [
                    div({ className: 'input-field col s10' }, [
                        input({ id: 'input-msg', className: 'validate', autofocus: true, value: '' }),
                        label({ className: 'active' }, 'Type your chat, enter or hit button to send'),
                    ]),
                    div({ className: 'input-field col s2' }, [
                        a({ id: 'send-btn', className: 'btn-floating btn-large waves-effect waves-light red' }, [
                            i({ className: 'material-icons' }, 'send'),
                        ]),
                    ]),
                ])
            );
        });


    return {
        DOM: vtree$,
        value$,
    };
}
