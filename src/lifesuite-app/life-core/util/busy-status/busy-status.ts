import { Subscription } from 'rxjs';
import { SubscriptionTracker } from 'life-core/event/subscription-tracker';

export type BusyStatusCallback = (status: boolean) => void;

export interface BusyStatusProvider {
    subscribe(callback: BusyStatusCallback): Subscription;
}

export class BusyStatus {
    private _busyStatusProviders: BusyStatusProvider[];

    private _subscriptionTracker: SubscriptionTracker;

    constructor(providers: BusyStatusProvider[]) {
        this._busyStatusProviders = providers;
        this._subscriptionTracker = new SubscriptionTracker();
    }

    public subscribe(callback: BusyStatusCallback): Subscription[] {
        this._busyStatusProviders.forEach(provider => {
            this._subscriptionTracker.track(provider.subscribe(callback));
        });
        return this._subscriptionTracker.subscriptions;
    }

    public destroy(): void {
        this._subscriptionTracker.destroy();
    }
}
