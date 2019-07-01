import { Component, Injector, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { RouterNavigationStatus } from 'life-core/routing/router-navigation-status';
import { TestMenu, TestMenuItem} from './test-menu';

@Component({
    selector: 'test-nav-bar',
	templateUrl: './test-nav-bar.html',
	providers: [
		RouterNavigationStatus
	]
})

export class TestNavBar implements OnInit, OnDestroy {

	protected _router: Router;

    protected selectedRoute: string;

    public isRouterNavigating: boolean;

	private _routerNavigationStatus: RouterNavigationStatus;

	private _routerSubscription: Subscription;

	protected menu: TestMenuItem[] = TestMenu.menuData;

	constructor(router: Router, routerNavigationStatus: RouterNavigationStatus) {
		this._router = router;
		this._routerNavigationStatus = routerNavigationStatus;
	}

	ngOnInit() {
		this.setupSubscriptions();
    }

	private setupSubscriptions(): void {
		this._routerSubscription = this._routerNavigationStatus.subscribe(status => this.updateBusyStatus(status));
	}

	protected navigate(url: string): void {
		this._router.navigateByUrl(url);
	}

	protected updateBusyStatus(status: boolean): void {
		this.isRouterNavigating = status;
	}

	public ngOnDestroy(): void {
		this.removeSubscriptions();
	}

	private removeSubscriptions(): void {
		this._routerSubscription.unsubscribe();
	}

}
