import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { IViewModel } from 'life-core/view-model';
import { PolicyDTO } from 'ls-core/model/dto';
import { AppSession } from './app-session';

@Injectable()
export class PolicySubscriber implements OnDestroy {
    private _appSession: AppSession;
    private _policy: PolicyDTO;
    private _subscription: Subscription;

    constructor(appSession: AppSession) {
        this._appSession = appSession;
    }

    public subscribe(subscriber: IViewModel, next?: (value: PolicyDTO) => void): Subscription {
        this.checkSubscription(subscriber);
        this._subscription = this._appSession.policyObservable.subscribe(policy => {
            if (this.needToUpdate(subscriber, policy)) {
                this._policy = policy;
                next(policy);
            }
        });
        return this._subscription;
    }

    public subscribeDirect(subscriber: IViewModel, next?: (value: PolicyDTO) => void): Subscription {
        this.checkSubscription(subscriber);
        this._subscription = this._appSession.policyObservable.subscribe(policy => {
            this._policy = policy;
            next(policy);
        });
        return this._subscription;
    }

    private checkSubscription(subscriber: IViewModel): void {
        if (this._subscription) {
            throw new Error(
                `Cannot re-use PolicySubscriber. Make sure ${
                    subscriber.constructor.name
                } component provides it's own PolicySubscriber .`
            );
        }
    }
    private needToUpdate(subscriber: IViewModel, newPolicy: PolicyDTO): boolean {
        return (
            !subscriber.componentTreeDeactivating &&
            (!this._policy || (newPolicy && newPolicy.PolicyId == this._policy.PolicyId))
        );
    }

    public ngOnDestroy(): void {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }
}
