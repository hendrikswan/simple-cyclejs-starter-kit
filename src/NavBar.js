import { Observable } from 'rx';
import { div, nav, a } from '@cycle/dom';

export default function NavBar() {
    const vtree$ = Observable.of(
        div({ className: 'navbar-fixed' }, [
            nav([
                div({ className: 'nav-wrapper container' }, [
                    a({ className: 'brand-logo left', href: '#' }, 'Cycle Chat'),
                ]),
            ]),
        ])
    );

    return {
        DOM: vtree$,
    };
}
