import { Observable } from 'rx';
import { div, nav, a } from '@cycle/dom';

export function navBar() {
    const vdom$ = Observable.of(
        div({ className: 'navbar-fixed' }, [
            nav([
                div({ className: 'nav-wrapper container' }, [
                    a({ className: 'brand-logo left', href: '#' }, 'Cycle Socket Chat'),
                ]),
            ]),
        ])
    );

    return vdom$;
}
