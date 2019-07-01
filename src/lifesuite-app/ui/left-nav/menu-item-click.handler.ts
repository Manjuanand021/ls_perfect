import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { MenuItemClickEvent } from 'life-core/component/menu';
import { TabDescriptor } from 'life-core/component/layout/tabview';

import { OpenURLDelegate } from 'ls-core/handler/open-url-delegate';

@Injectable()
export class MenuItemClickHandler {
    private _router: Router;
    private _activeTab: TabDescriptor;
    private _activatedRoute: ActivatedRoute;
    private _openURLDelegate: OpenURLDelegate;

    constructor(router: Router, activatedRoute: ActivatedRoute, openURLDelegate: OpenURLDelegate) {
        this._router = router;
        this._activatedRoute = activatedRoute;
        this._openURLDelegate = openURLDelegate;
    }

    public onMenuItemClick(event: MenuItemClickEvent): void {
        if (event.data.route) {
            this.handleMenuItemWithRoute(event);
        } else if (event.data.command) {
            this.handleMenuItemWithCommand(event);
        } else if (event.data.url) {
            this.openURLInNewTab(event.data.url);
        }
    }

    public updateActiveTab(newTab: TabDescriptor): void {
        this._activeTab = newTab;
    }

    private openURLInNewTab(url: string): void {
        this._openURLDelegate.openURL(url);
    }

    private handleMenuItemWithRoute(event: MenuItemClickEvent): void {
        const menuItem = event.data;
        if (this._activeTab.contentRoute != menuItem.route) {
            this._router.navigate([menuItem.url], { relativeTo: this._activatedRoute }).then(result => {
                if (result) {
                    this.updateActiveContentRoute(menuItem.route);
                }
            });
        }
    }

    private handleMenuItemWithCommand(event: MenuItemClickEvent): void {
        const menuItem = event.data;
        menuItem.command(event);
    }

    private updateActiveContentRoute(route: string): void {
        this._activeTab.contentRoute = route;
    }
}
