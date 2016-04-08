import { Observable } from 'rx';

function MessageHTTP({ HTTP, props: { messageAdded$ } }) {
    const pollRequest$ = Observable
        .interval(1000)
        .map(() => {
            return {
                url: 'http://localhost:3000/messages',
                category: 'messagePoll',
            };
        });

    const response$ = HTTP
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
            eager: true,
        }));


    return {
        request$: pollRequest$.merge(messagePostRequest$),
        response$,
    };
}


export default MessageHTTP;
