import { Client, over } from 'stompjs';
import SockJS from 'sockjs-client';
import { v4 as uuidv4 } from 'uuid';

export function init(url: string): Client {
    var socket = new SockJS(url);
    var stompClient = over(socket);
    stompClient.heartbeat.incoming = 4000;
    stompClient.heartbeat.outgoing = 4000;

    return stompClient;
}

export function connect(stompClient: Client): string {
    const clientId = uuidv4();

    stompClient.connect(
        {},
        function (frame) {
            console.log('Connected: ' + frame?.toString());
        },
        function(error) {
            // display the error's message header:
            console.log(error.toString());
        }
    );

    return clientId;
}

export function disconnect(stompClient: Client): void {
    stompClient.disconnect(function () {
        console.log("disconnected")
    })
}
