import { Observable as $ } from 'rx';

function MessageHTTP({ HTTP, props: { messageAdded$ } }) {
    // function addMessageListCycle() {
    const messagePollRequest$ = $
        .interval(1000)
        .map(() => {
            return {
                url: 'http://localhost:3000/messages',
                category: 'messagePoll',
            };
        });

    const messagePollResponse$ = HTTP
        .filter(res$ => res$.request.category === 'messagePoll')
        .flatMap(x => x)
        .map(res => res.body);

    const messagePostRequest$ = messageAdded$
        .map(msg => ({
            url: 'http://localhost:3000/messages',
            category: 'messagePost',
            method: 'POST',
            send: {
                text: msg,
            },
        }));

    const messagePostResponse$ = HTTP
        .filter(res$ => res$.request.category === 'messagePost')
        .flatMap(x => x)
        .map(res => res.body);



    const channelPollRequest$ = $
        .interval(1000)
        .map(() => {
            return {
                url: 'http://localhost:3000/channels',
                category: 'channelPoll',
            };
        });

    const channelPollResponse$ = HTTP
        .filter(res$ => res$.request.category === 'channelPoll')
        .flatMap(x => x)
        .map(res => res.body);

    return {
        request$: $.merge(
             channelPollRequest$,
             messagePollRequest$,
             messagePostRequest$
        ),
        messagePollResponse$,
        channelPollResponse$,
        messagePostResponse$,
    };
    // }
    //
    // addMessageListCycle();
}


export default MessageHTTP;
