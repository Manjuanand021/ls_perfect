import { Injectable } from '@angular/core';
import { Router, RoutesRecognized, ActivatedRouteSnapshot } from '@angular/router';

import { SubscriptionTracker } from 'life-core/event/subscription-tracker';
import { filter } from 'rxjs/operators';

@Injectable()
export class NextRouteRecognizer {
    private _router: Router;

    private _nextRoute: ActivatedRouteSnapshot;

    private _subscriptionTracker: SubscriptionTracker;

    constructor(router: Router) {
        this._router = router;
        this._subscriptionTracker = new SubscriptionTracker();
        this._subscribeToRouterEvents();
    }

    private _subscribeToRouterEvents(): void {
        this._subscriptionTracker.track(
            this._router.events
                .pipe(filter(e => e instanceof RoutesRecognized))
                // .map(e => <RoutesRecognized>e)
                .subscribe((e: RoutesRecognized) => {
                    this._nextRoute = e.state.root.firstChild;
                })
        );
    }

    public get nextRoute(): ActivatedRouteSnapshot {
        return this._nextRoute;
    }

    public destroy(): void {
        this._subscriptionTracker.destroy();
    }
}
