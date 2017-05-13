import { Injectable, EventEmitter, Output, OpaqueToken } from '@angular/core';
import { ServiceBase } from './servicebase';

import { Subject } from 'rxjs/Subject';


@Injectable()
export class Message {
    subject: string;
    message: any;

    constructor(subject: string, message: any) {
        this.subject = subject;
        this.message = message;
    }
}

@Injectable()
export class MessageService extends ServiceBase {
    @Output() public received: EventEmitter<Message> = new EventEmitter<Message>(false);

    private messageObservables: Map<string, MessageObservable> = new Map();

    constructor() {
        super();
    }

    public BoradCaset(message: Message) {
        this.received.emit(message);
    }

    public On(moduleId: string, observerOrNext?: any) {
        this.getMessageObservable(moduleId).subscribe(observerOrNext);
    }

    public Send(moduleId: string, message: Message) {
        this.getMessageObservable(moduleId).next(message);
    }

    private getMessageObservable(moduleId: string): MessageObservable {
        let messageObservable = this.messageObservables.get(moduleId);
        if (!messageObservable) {
            messageObservable = new MessageObservable();
            this.messageObservables.set(moduleId, messageObservable);
        }

        return messageObservable;
    }
}

export class MessageObservable extends Subject<Message> {
    constructor() {
        super();
    }
}
