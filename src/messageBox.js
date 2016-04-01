import { Observable } from 'rx';
import { div, input, label, a, i } from '@cycle/dom';

export function textEntryIntentWithSendButtonClicked(DOMSource) {
    const textStream$ = DOMSource.select('#input-msg').events('keyup').map(e => e.target);
    const buttonClick$ = DOMSource.select('#send-btn').events('click').map(e => e.target);

    return { textStream$, buttonClick$ };
}

export function textEntryIntentWithEnterKeyPressed(DOMSource) {
    const textStream$ = DOMSource.select('#input-msg').events('keyup').filter(textStream => textStream.keyCode !== 13).map(e => e.target);
    const enterKeyPressed$ = DOMSource.select('#input-msg').events('keyup').filter(textStream => textStream.keyCode === 13).map(e => e.target);

    return { textStream$, enterKeyPressed$ };
}

export function textEntry() {
    const vdom$ = Observable.of(
        div({ className: 'row' }, [
            div({ className: 'input-field col s10' }, [
                input({ id: 'input-msg', className: 'validate', autofocus: true }),
                label({ className: 'active' }, 'Type your chat, enter or hit button to send'),
            ]),
            div({ className: 'input-field col s2' }, [
                a({ id: 'send-btn', className: 'btn-floating btn-large waves-effect waves-light red' }, [
                    i({ className: 'material-icons' }, 'send'),
                ]),
            ]),
        ])
    );

    return vdom$;
}
