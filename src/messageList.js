import { Observable } from 'rx';
import { div } from '@cycle/dom';

export function messageList() {
    const vdom$ = Observable.of(
        div({ className: 'message-list' }, 'the message list')
    );

    return vdom$;
}
