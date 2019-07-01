import { Subscription } from 'rxjs';

export class SubscriptionTracker {
    private _subscriptions: Subscription[];

    constructor() {
        this._subscriptions = [];
    }

    public track(s: Subscription | Subscription[]): void {
        if (s instanceof Array) {
            this._subscriptions.push(...s);
        } else {
            this._subscriptions.push(s);
        }
    }

    public destroy(): void {
        this._subscriptions.forEach((s: Subscription) => s.unsubscribe());
        this._subscriptions = [];
    }

    public get subscriptions(): Subscription[] {
        return this._subscriptions;
    }
}
