import { Observable } from 'rx';
import { div, input, label, a, i } from '@cycle/dom';

function intent(sources) {
    const { DOM } = sources;
    const textStream$ = DOM.select('#input-msg').events('keyup').map(e => e.target);
    const buttonClick$ = DOM.select('#send-btn').events('click').map(e => e.target);

    // return { textStream$, buttonClick$ };


    const text$ = buttonClick$.withLatestFrom(textStream$, (buttonClick, textStream) => {
        return textStream;
    })
    .map(textInput => textInput.value)
    .filter(msg => msg.length > 0);

    return text$.share();
}

// export function textEntryIntentWithEnterKeyPressed(DOMSource) {
//     const textStream$ = DOMSource.select('#input-msg').events('keyup').filter(textStream => textStream.keyCode !== 13).map(e => e.target);
//     const enterKeyPressed$ = DOMSource.select('#input-msg').events('keyup').filter(textStream => textStream.keyCode === 13).map(e => e.target);
//
//     return { textStream$, enterKeyPressed$ };
// }

export default function MessageBox(sources) {
    // const vtree$ = sources.HTTP
    //     .filter(res$ => res$.request.category === 'messagePost')
    //     .startWith(null)
    //     .map((val) => {
    //         let inputVtree = input({ id: 'input-msg', className: 'validate', autofocus: true });
    //         if (val) {
    //             inputVtree = input({ id: 'input-msg', className: 'validate', autofocus: true, value: null });
    //         }
    //
    //
    //         return Observable.of(
    //             div({ className: 'row' }, [
    //                 div({ className: 'input-field col s10' }, [
    //                     inputVtree,
    //                     label({ className: 'active' }, 'Type your chat, enter or hit button to send'),
    //                 ]),
    //                 div({ className: 'input-field col s2' }, [
    //                     a({ id: 'send-btn', className: 'btn-floating btn-large waves-effect waves-light red' }, [
    //                         i({ className: 'material-icons' }, 'send'),
    //                     ]),
    //                 ]),
    //             ])
    //         );
    //     });

    const value$ = intent(sources);

    const vtree$ = value$
        .startWith(null)
        .map(() => {
            // let inputVtree = input({ id: 'input-msg', className: 'validate', autofocus: true });
            // if (val) {
            const inputVtree = input({ id: 'input-msg', className: 'validate', autofocus: true, value: '' });
            // }


            return Observable.of(
                div({ className: 'row' }, [
                    div({ className: 'input-field col s10' }, [
                        inputVtree,
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
