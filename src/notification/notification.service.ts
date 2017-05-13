import { Injectable } from '@angular/core';

import { Context } from '../context';
import { Message } from '../messageservice';
import { NotificationConfig } from './config.model';
import { WebSocketService } from './websocket.service';

@Injectable()
export class NotificationService {
    private connections: Map<string, WebSocketService>;
    private listeners: Map<string, boolean>;

    constructor() {
        this.connections = new Map<string, WebSocketService>();
        this.listeners = new Map<string, boolean>();
    }

    /**
     * @description Add a listener to specific system channel.
     * @param {string} url The URL of the websocket server.
     * @param {string} channel Target channel.
     */
    public addListener(url: string, channel: string) {
        url = `${Context.instance.wsServiceDomain}${url}`;
        this.addListenerHandler(url, channel);
    }

    /**
     * @description Set websocket connect to server.
     * @param {string} url The URL of the websocket server.
     * @return {boolean} true if the server is already connected, otherwise false.
     */
    public connect(url: string, ext?: {ext: {user: string; token?: string}}): boolean {
        url = `${Context.instance.wsServiceDomain}${url}`;
        let config: NotificationConfig = new NotificationConfig(url);
        return this.getWebSocket(url).connet(config);
    }

    /**
     * @description Publish data to specific channel.
     * @param {string} url The URL of the websocket server.
     * @param {string} channel Target channel.
     * @param {any} data message data to push.
     */
    public publish(url: string, channel: string, data: any) {
        url = `${Context.instance.wsServiceDomain}${url}`;
        this.getWebSocket(url).publish(channel, data);
    }

    /**
     * @description Subscribe channel to specific websocket.
     * @param {string} url The URL of the websocket server.
     * @param {string} channel Target channel.
     * @param {(message: any) => void} callback The callback related to this subscription.
     * @return {any} The instance of subscribe.
     */
    public subscribe(url: string, channel: string, callback: (url: string, message: any) => void): any {
        url = `${Context.instance.wsServiceDomain}${url}`;
        return this.getWebSocket(url).subscribe(channel, (_url: string, message: any) => {
            callback(_url, message);
        });
    }

    /**
     * @description Unsubscribe channel to specific websocket.
     * @param {string} url The URL of the websocket server.
     * @param {any} subscription The instance of subscribe.
     */
    public unSubscribe(url: string, subscription: any) {
        url = `${Context.instance.wsServiceDomain}${url}`;
        this.getWebSocket(url).unSubscribe(subscription);
    }

    /**
     * @description Add a listener to specific system channel.
     * @param {string} url The URL of the websocket server.
     * @param {string} channel Target channel.
     */
    private addListenerHandler(url: string, channel: string) {
        let key: string = url + channel;
        if (!this.listeners.has(key)) {
            this.getWebSocket(url).addListener(channel, (_url: string, data: any) => {
                this.listenerHandler(_url, data);
            });

            this.listeners.set(key, true);
        }
    }

    /**
     * @description Get websocket with specific url.
     * @param {string} url The URL of the websocket server.
     * @return {WebSocketService}
     */
    private getWebSocket(url: string): WebSocketService {
        if (!this.connections.has(url)) {
            let websocket: WebSocketService = new WebSocketService(url);
            this.connections.set(url, websocket);

            this.addListenerHandler(url, '/meta/handshake');
            this.addListenerHandler(url, '/meta/connect');
        }

        return this.connections.get(url);
    }

    /**
     * @description Handle the response to websocket listeners.
     * @param {string} url The URL of the websocket server.
     * @param {string} data The body of the response.
     */
    private listenerHandler(url: string, data: any) {

        let body: any = new Object();

        if (data.successful === false) {
            body.channel = data.channel;
            body.id = data.id;
            body.successful = data.successful;
        } else {
            body = data;
        }

        body.url = url;

        let message: Message = new Message(data.channel, body);
        Context.instance.messageService.BoradCaset(message);
    }
}
