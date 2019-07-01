import { Component, Injector, Input } from '@angular/core';

import { IGridColumnsBuilder, BaseGridViewModel } from 'life-core/component/grid';
import { ParentChildRegistry } from 'life-core/view-model';

import { AuthorizationLimitDTO, UserDTO } from 'ls-core/model';
import { PolicySubscriber } from 'ls-core/session';

import { AuthorizationLimitGridColumnsBuilder } from 'ui/top-nav/preferences/authorization-list/preferences-authorization-columns.builder';

@Component({
    selector: 'authorization-grid',
    templateUrl: 'preferences-authorization.component.html',
    providers: [ParentChildRegistry, AuthorizationLimitGridColumnsBuilder, PolicySubscriber]
})
export class PreferencesAuthorizationGridComponent extends BaseGridViewModel<AuthorizationLimitDTO> {
    @Input()
    public set user(value: UserDTO) {
        this._user = value;
        this.refreshGrid();
    }

    private _gridColumnsBuilder: IGridColumnsBuilder;
    private _user: UserDTO;

    constructor(injector: Injector, gridColumnsBuilder: AuthorizationLimitGridColumnsBuilder) {
        super(injector);
        this._gridColumnsBuilder = gridColumnsBuilder;
    }

    protected setGridTitle(): string {
        return '';
    }

    public loadData(): Promise<void> {
        this.gridOptions = this.getGridOptions();
        return Promise.resolve();
    }

    protected loadItems(): AuthorizationLimitDTO[] {
        return this._user.AuthorizationLimits_LazyLoad || [];
    }

    protected getGridColumnsBuilder(): IGridColumnsBuilder {
        return this._gridColumnsBuilder;
    }

    protected getRowNodeId(data: any): any {
        return data.LineOfBusinessCode;
    }
}
