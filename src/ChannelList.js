import { div } from '@cycle/dom';

export default function ContactList({ props: { channel$ } }) {
    const vtree$ =
        channel$
        .map(channels => div({ className: 'channel-list' },
            channels.map(channel =>
                div({
                    className: 'channel',
                    style: {
                        padding: '10px',
                    },
                }, channel.name)
            )
        ));

    return {
        DOM: vtree$,
    };
}
