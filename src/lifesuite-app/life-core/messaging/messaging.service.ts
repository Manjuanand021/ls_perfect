import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

import { IMessagingChannel, MessagingChannel } from './messaging-channel';
import { ISubscriber } from './base-subscriber';

export interface IMessagingService {
    /**
     * Publishes to a channel.
     */
    publish(channelId: string, value?: any): void;

    /**
     * Subscribes to a channel.
     */
    subscribe(
        channelId: string,
        next?: (value: any) => void,
        error?: (error: any) => void,
        complete?: () => void
    ): Subscription;

    /**
     * Subscribes to a channel and receive the next new message only.
     */
    subscribeNewMessageOnly(
        channelId: string,
        next?: (value: any) => void,
        error?: (error: any) => void,
        complete?: () => void
    ): Subscription;

    /**
     * Subscribes once to a channel. This closes subscription immediately.
     */
    subscribeOnce(
        channelId: string,
        next?: (value: any) => void,
        error?: (error: any) => void,
        complete?: () => void
    ): void;

    /**
     * Subscribes exclusively to a channel. This closes subscription AND channel immediately, preventing other potential subscribes from receiving this message.
     */
    subscribeExclusively(
        channelId: string,
        next?: (value: any) => void,
        error?: (error: any) => void,
        complete?: () => void
    ): void;

    /**
     * Subscribes to a channel based on ISubscriber interface
     */
    subscribe2(channelId: string, subscriber: ISubscriber): void;

    /**
     * Checks if channel exists.
     */
    channelExist(channelId: string): boolean;

    /**
     * Closes messaging channel, removing all subscribers.
     */
    closeChannel(channelId: string): void;
}

@Injectable()
export class MessagingService implements IMessagingService {
    private _channels: Map<string, IMessagingChannel>;

    constructor() {
        this._channels = new Map<string, IMessagingChannel>();
    }

    public publish(channelId: string, value?: any): void {
        const channel = this.getChannel(channelId, true);
        channel.publish(value);
    }

    public subscribe(
        channelId: string,
        next?: (value: any) => void,
        error?: (error: any) => void,
        complete?: () => void
    ): Subscription {
        const channel = this.getChannel(channelId, true);
        return channel.subscribe(next, error, complete);
    }

    public subscribeNewMessageOnly(
        channelId: string,
        next?: (value: any) => void,
        error?: (error: any) => void,
        complete?: () => void
    ): Subscription {
        const channel = this.getChannel(channelId, true);
        let firstTime = true;
        const func = (item: any) => {
            if (!firstTime) next(item);
        };
        const result = channel.subscribe(func, error, complete);
        firstTime = false;
        return result;
    }

    public subscribeOnce(
        channelId: string,
        next?: (value: any) => void,
        error?: (error: any) => void,
        complete?: () => void
    ): void {
        const subscription = this.subscribe(channelId, next, error, complete);
        subscription.unsubscribe();
    }

    public subscribeExclusively(
        channelId: string,
        next?: (value: any) => void,
        error?: (error: any) => void,
        complete?: () => void
    ): void {
        const subscription = this.subscribe(channelId, next, error, complete);
        subscription.unsubscribe();
        this.closeChannel(channelId);
    }

    public subscribe2(channelId: string, subscriber: ISubscriber): Subscription {
        const channel = this.getChannel(channelId, true);
        const receive = function(payload: any): void {
            return subscriber.receive(payload);
        };
        const error = function(payload: any): void {
            return subscriber.error(payload);
        };
        const complete = function(): void {
            return subscriber.complete();
        };
        return channel.subscribe(receive, error, complete);
    }

    public channelExist(channelId: string): boolean {
        return this._channels.has(channelId);
    }

    public closeChannel(channelId: string): void {
        const channel = this.getChannel(channelId);
        if (channel) {
            channel.close();
            this.removeChannel(channelId);
        } else {
            throw new Error(`ChannelId [${channelId}] is not found!`);
        }
    }

    /**
     * This method is only used for unit testing.
     */
    public get numberOfChannels(): number {
        return this._channels.size;
    }

    private getChannel(channelId: string, createIfNotFound: boolean = false): IMessagingChannel {
        let channel: IMessagingChannel;
        if (this._channels.has(channelId)) {
            channel = this._channels.get(channelId);
        } else if (createIfNotFound) {
            channel = this.createChannel(channelId);
        }
        return channel;
    }

    private createChannel(channelId: string): IMessagingChannel {
        const channel = new MessagingChannel();
        this._channels.set(channelId, channel);
        return channel;
    }

    private removeChannel(channelId: string): void {
        this._channels.delete(channelId);
    }

    public destroy(): void {
        this._channels.forEach((channel, channelId) => {
            this.closeChannel(channelId);
        });
    }
}
