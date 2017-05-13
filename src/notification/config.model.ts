import { Injectable } from '@angular/core';

@Injectable()
export class NotificationConfig {
    url: string;
    logLevel?: string;
    maxConnections?: Number;
    backoffIncrement?: Number;
    maxBackoff?: Number;
    reverseIncomingExtensions?: Boolean;
    maxNetworkDelay?: Number;
    requestHeaders?: any;
    appendMessageTypeToURL?: Boolean;
    autoBatch?: Boolean;
    connectTimeout?: Number;
    stickyReconnect?: Boolean;
    maxURILength?: Number;

    constructor(url: string) {
        this.url = url;
    }
}
