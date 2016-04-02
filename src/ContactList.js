import { Observable } from 'rx';
import { div } from '@cycle/dom';

export default function ContactList() {
    const vtree$ = Observable.of(
        div({ className: 'contact-list' }, 'the contact list')
    );

    return {
        DOM: vtree$,
    };
}
