import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';

import { NotificationConfig } from './config.model';
declare var $: any;

@Injectable()
export class WebSocketService {
    private cometd: any = $.cometd;
    private url: string;
    private isConnect: boolean;

    constructor(url: string) {
        this.url = url;
        this.isConnect = false;
    }

    /**
     * @description Add a listener to specific system channel.
     * @param {string} channel Target channel.
     * @param {(url: string, message: any) => void} callback The callback related to this listener.
     * @return {any} The instance of listener.
     */
    public addListener(channel: string, callback: (url: string, message: any) => void): any {
        return this.cometd.addListener(channel, (message) => {
            if (message.channel === '/meta/connect') {
                this.isConnect = message.successful === true;
            }
            callback(this.url, message);
        });
    }

    /**
     * @description Remove listener to specific system channel.
     * @param {any} listener The instance of listener.
     */
    public removeListener(listener: any) {
        this.cometd.removeListener(listener);
    }

    /**
     * @description Subscribe channel to specific websocket.
     * @param {string} channel Target channel.
     * @param {(message: any) => void} callback The callback related to this subscription.
     * @return {any} The instance of subscribe.
     */
    public subscribe(channel: string, callback: (url: string, message: any) => void): any {
        return this.cometd.subscribe(channel, (message) => {
            callback(this.url, message);
        });
    }

    /**
     * @description Unsubscribe channel to specific websocket.
     * @param {any} subscription The instance of subscribe.
     */
    public unSubscribe(subscription: any) {
        this.cometd.unsubscribe(subscription);
    }

    /**
     * @description Set websocket connect to server.
     * @param {NotificationConfig} config Connect configuration.
     * @return {boolean} true if the server is already connected, otherwise false.
     */
    public connet(config: NotificationConfig, ext?: {ext: {user: string; token?: string}}): boolean {
        if (!this.isConnect) {
            this.cometd.configure(config);
            this.cometd.handshake(ext);
            return false;
        } else {
            return true;
        }
    }

    /**
     * @description Publish data to specific channel.
     * @param {string} channel Target channel.
     * @param {any} data message data to push.
     */
    public publish(channel: string, data: any) {
        this.cometd.publish(channel, data);
    }

    /**
     * @description Publish batch operation to websocket.
     * @param {() => void} callback batch operation commands.
     */
    public batch(callback: () => void) {
        return this.cometd.batch(() => callback());
    }

    /**
     * @description Get url to websocket.
     * @return {string} websocket url.
     */
    public getUrl(): string {
        return this.url;
    }

    /**
     * @description Get status to websocket connection.
     * @return {boolean} websocket connection status.
     */
    public getIsConnect(): boolean {
        return this.isConnect;
    }
}
