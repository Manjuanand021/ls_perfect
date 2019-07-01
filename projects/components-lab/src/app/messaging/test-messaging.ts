import { Component, Injectable, Injector, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { MessagingService } from 'life-core/messaging';

export class MessageData {
    value: string;

    constructor(value: string) {
        this.value = value;
    }
}

export const CHANNEL_ID_A: string = 'channel-id-a';
export const CHANNEL_ID_B: string = 'channel-id-b';

@Component({
    selector: 'test-messaging',
    template: `
		<div style="height: 50px; line-height: 50px;">
			Open Console panel to see results.
		</div>
		<div style="height: 50px">
			<lf-button label="Publish to Channel A" (onClick)="publish('channel-id-a', 'Message A')"></lf-button>
			<lf-button label="Complete for A" (onClick)="complete('channel-id-a')"></lf-button>
		</div>
		<div style="height: 50px">
			<lf-button label="Publish to Channel B" (onClick)="publish('channel-id-b', 'Message B')"></lf-button>
			<lf-button label="Complete for B" (onClick)="complete('channel-id-b')"></lf-button>
		</div>
		<comp-a></comp-a>
		<comp-b></comp-b>
	`
})
@Injectable()
export class TestMessaging implements OnDestroy {
    constructor(private _msgService: MessagingService) {}

    publish(channelId: string, message: string): void {
        this._msgService.publish(channelId, new MessageData(message));
    }

    complete(channelId: string): void {
        this._msgService.closeChannel(channelId);
    }

    ngOnDestroy(): void {
        this._msgService.closeChannel(CHANNEL_ID_A);
        this._msgService.closeChannel(CHANNEL_ID_B);
    }
}

export class BaseSubscriptionComponent implements OnDestroy {
    protected msgService: MessagingService;

    protected channel: string;

    protected componentName: string;

    protected _subscription: Subscription;

    constructor(msgService: MessagingService, channel) {
        this.msgService = msgService;
        this.channel = channel;
        this.subscribe(channel);
    }

    subscribe(channelId: string) {
        this._subscription = this.msgService.subscribe(channelId, message => {
            console.log(`${this.componentName} Subscription: [ ${message.value} ]`);
        });
    }

    subscribeOnce(channelId: string) {
        this.msgService.subscribeOnce(channelId, message => {
            console.log(`${this.componentName} Subscription: [ ${message.value} ]`);
        });
    }

    ngOnDestroy(): void {
        this._subscription.unsubscribe();
    }
}

@Component({
    selector: 'comp-a',
    template: `
		<div style="padding: 30px;">
			<b>{{componentName}}</b>
			<div>
				<lf-button label="Subscribe to A" (onClick)="subscribe('channel-id-a')"></lf-button>
				<lf-button label="Subscribe Once to A" (onClick)="subscribeOnce('channel-id-a')"></lf-button>
			<div>
		</div>
	`
})
@Injectable()
export class CompA extends BaseSubscriptionComponent {
    componentName: string = 'Component A';

    constructor(msgService: MessagingService) {
        super(msgService, CHANNEL_ID_A);
    }
}

@Component({
    selector: 'comp-b',
    template: `
		<div style="padding: 30px;">
			<b>{{componentName}}</b>
			<div>
				<lf-button label="Subscribe to B" (onClick)="subscribe('channel-id-b')"></lf-button>
				<lf-button label="Subscribe Once to B" (onClick)="subscribeOnce('channel-id-b')"></lf-button>
			<div>
		<div>
	`
})
@Injectable()
export class CompB extends BaseSubscriptionComponent {
    componentName: string = 'Component B';

    constructor(msgService: MessagingService) {
        super(msgService, CHANNEL_ID_B);
    }
}
