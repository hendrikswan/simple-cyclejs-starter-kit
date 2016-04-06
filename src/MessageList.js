import { div } from '@cycle/dom';

export default function MessageList({ props }) {
    const vtree$ =
        props.messages$
        .map(messages => div({ className: 'message-list' },
            messages.map(message =>
                div({
                    className: 'message',
                    style: {
                        padding: '10px',
                    },
                }, message.text)
            )
        ));

    return {
        DOM: vtree$,
    };
}
