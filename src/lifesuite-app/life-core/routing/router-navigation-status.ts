import { Injectable } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

import { Subscription } from 'rxjs';

import { BusyStatusProvider, BusyStatusCallback } from 'life-core/util/busy-status';

@Injectable({ providedIn: 'root' })
export class RouterNavigationStatus implements BusyStatusProvider {
    private _router: Router;

    constructor(router: Router) {
        this._router = router;
    }

    public subscribe(callback: BusyStatusCallback): Subscription {
        return this.subscribeToRouterNavigationStatus(callback);
    }

    private subscribeToRouterNavigationStatus(callback: BusyStatusCallback): Subscription {
        return this._router.events.subscribe(event => {
            if (this.navigatingStarted(event)) {
                callback(true);
            } else if (this.navigationStopped(event)) {
                callback(false);
            }
        });
    }

    private navigatingStarted(event: Event): boolean {
        return event instanceof NavigationStart;
    }

    private navigationStopped(event: Event): boolean {
        return event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError;
    }
}
