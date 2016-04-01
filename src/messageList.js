import { Observable } from 'rx';
import { div } from '@cycle/dom';

export function messageList(sources, messages) {
    const vdom$ = Observable.of(
        div({ className: 'message-list' },
            messages.map(message =>
                div({ className: 'message' }, message.text)
            )
        )
    );

    return vdom$;
}
