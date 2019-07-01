import { Component, Injector, Injectable, SkipSelf, Optional } from '@angular/core';

import { ViewModel, ParentChildRegistry } from 'life-core/view-model';
import { AuthorizationLevel, AuthorizationProvider } from 'life-core/authorization';
import { ListItem } from 'life-core/model/list.model';

@Injectable()
export class DefaultAuthorizationProvider extends AuthorizationProvider {
    constructor(
        @SkipSelf()
        @Optional()
        parentAuthProvider: AuthorizationProvider
    ) {
        super(parentAuthProvider);
    }

    protected setup(): void {
        this.authorizationData.defaultLevel = AuthorizationLevel.EDIT;
    }
}

@Component({
    selector: 'test-authorization',
    templateUrl: './test-authorization.html',
    providers: [ParentChildRegistry, { provide: AuthorizationProvider, useClass: DefaultAuthorizationProvider }]
})
export class TestAuthorization extends ViewModel {
    authorizationLevels: Array<ListItem<number>> = [
        new ListItem('Edit', AuthorizationLevel.EDIT),
        new ListItem('View', AuthorizationLevel.VIEW),
        new ListItem('None', AuthorizationLevel.NONE)
    ];

    private _thisAuthProvider: AuthorizationProvider;

    constructor(injector: Injector, authorizationProvider: AuthorizationProvider) {
        super(injector);
        this._thisAuthProvider = authorizationProvider;
    }

    public ngAfterViewInit(): void {
        super.ngAfterViewInit();
        this.onAuthorizationLevelChanged(AuthorizationLevel.EDIT);
    }

    public onAuthorizationLevelChanged(level: AuthorizationLevel) {
        (this._thisAuthProvider as any).authorizationData.defaultLevel = level;
        this.routerAccessor.navigate(['all', level.toString()], true);
    }
}
