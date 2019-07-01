import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AppSession } from 'ls-core/session';
import { RoutePath } from 'life-core/routing';

@Component({
    selector: 'sso-logout',
    templateUrl: './sso-logout.component.html'
})
export class SSOLogoutComponent {
    public message: string;

    private _route: ActivatedRoute;

    constructor(appSession: AppSession, route: ActivatedRoute) {
        this._route = route;
        this.setMessage(appSession.initializeError);
    }

    private setMessage(sessionMessage: string): void {
        const message = Messages[this._route.routeConfig.path];
        this.message = message || Messages[RoutePath.SSOLogoutDefault];
    }
}

const Messages = {
    [RoutePath.SSOLogoutDefault]: 'You have been successfully logged out.',
    [RoutePath.SSOLogoutOnSessionTimeout]: 'Your session has been closed due to inactivity.',
    [RoutePath.SSOLogoutOnUnauthorized]: 'HTTP Error: Unauthorized (401).'
};
