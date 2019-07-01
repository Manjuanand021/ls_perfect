import { Injectable } from '@angular/core';
import { BehaviorSubject ,  Subscription } from 'rxjs';

import { map, filter } from 'rxjs/operators';

export interface IMessagingChannel {
    /**
     * Publish to a messaging channel
     */
    publish(value?: any): void;

    /**
     * Subscribe to a messaging channel
     */
    subscribe(next?: (value: any) => void, error?: (error: any) => void, complete?: () => void): Subscription;

    /**
     * Close messaging channel, removing all subscribers
     */
    close(): void;
}

const DEFAULT_VALUE = '__undefined__';

@Injectable()
export class MessagingChannel implements IMessagingChannel {
    // From http://reactivex.io/documentation/subject.html:
    // "When an observer subscribes to a BehaviorSubject,
    // it begins by emitting the item most recently emitted by the source Observable
    // (or a seed/default value if none has yet been emitted),
    // and then continues to emit any other items emitted later by the source Observable(s)."
    protected subject: BehaviorSubject<MessagePayload<any>>;

    constructor() {
        this.subject = new BehaviorSubject<MessagePayload<any>>(new MessagePayload<any>(DEFAULT_VALUE));
    }

    public publish(value?: any): void {
        this.subject.next(new MessagePayload(value));
    }

    public subscribe(next?: (value: any) => void, error?: (error: any) => void, complete?: () => void): Subscription {
        return this.subject
            .asObservable()
            .pipe(
                map(payload => payload.value),
                // Filter out the initial (default) value sent by BehaviorSubject
                // when subscription takes place before anything has been emitted by observable
                filter(value => value != DEFAULT_VALUE)
            )
            .subscribe(next, error, complete);
    }

    public close(): void {
        this.subject.complete();
    }
}

/**
 * Wrapper class for Message value;
 * provided for future extensibility
 */
class MessagePayload<T> {
    public value?: T;

    constructor(value?: T) {
        this.value = value;
    }
}
