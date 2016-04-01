import { Observable } from 'rx';
import { div } from '@cycle/dom';

export function contactList() {
    const vdom$ = Observable.of(
        div({ className: 'contact-list' }, 'the contact list')
    );

    return vdom$;
}
