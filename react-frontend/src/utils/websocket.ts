import { Client, IStompSocket } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { v4 as uuidv4 } from 'uuid';

export function init(url: string): Client {
    const client = new Client({
        webSocketFactory: function(){
            return new SockJS(url) as IStompSocket;
        },
        connectHeaders: {
            "sessionId": uuidv4(),
        },
        onConnect: () => {
            console.log("ws opened");
        },
        onDisconnect: () => {
            console.log("disconnected")
        },
        onStompError: (frame) => {
            console.log('Broker reported error: ' + frame.headers['message']);
            console.log('Additional details: ' + frame.body);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
    });

    return client;
}
