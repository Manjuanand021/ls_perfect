import { Injectable } from '@angular/core';
import { Router, NavigationStart, RouterEvent } from '@angular/router';
import { Subscription } from 'rxjs';
import { map, filter, take } from 'rxjs/operators';
import { BrowserRefreshForbiddenRoutes } from 'life-core/routing/browser-refresh-forbidden-routes';

import { RoutePath } from './route-path';

@Injectable({ providedIn: 'root' })
export class BrowserRefreshHandler {
    private _router: Router;
    private _subscription: Subscription;

    constructor(router: Router) {
        this._router = router;
    }

    public handlerRefresh(): void {
        this._subscription = this._router.events
            .pipe(
                filter(
                    (event: RouterEvent) => this.isNavigationStartEvent(event) && this.isRefreshAllowedRoute(event.url)
                ),
                map(event => {
                    return !this._router.navigated;
                }),
                filter((browserRefreshed: boolean) => browserRefreshed),
                take(1) // consider only first emission
            )
            .subscribe(() => {
                this.navigateToDefaultRoute();
            });
    }

    private navigateToDefaultRoute(): void {
        this._router.navigateByUrl(RoutePath.App);
    }

    private isNavigationStartEvent(event: RouterEvent): boolean {
        return event instanceof NavigationStart;
    }
    private isRefreshAllowedRoute(url: string): boolean {
        return !BrowserRefreshForbiddenRoutes.some(ignoredUrl => url.endsWith(ignoredUrl));
    }
    public ngOnDestroy(): void {
        this._subscription.unsubscribe();
    }
}
