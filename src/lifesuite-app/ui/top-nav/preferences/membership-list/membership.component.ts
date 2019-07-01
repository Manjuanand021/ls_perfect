import { Component, Injector, Input } from '@angular/core';

import { IGridColumnsBuilder, BaseGridViewModel } from 'life-core/component/grid';
import { ParentChildRegistry } from 'life-core/view-model';

import { UserTeamProxyDTO, UserDTO } from 'ls-core/model';
import { PolicySubscriber } from 'ls-core/session';

import { MembershipGridColumnsBuilder } from 'ui/top-nav/preferences/membership-list/membership-columns.builder';

@Component({
    selector: 'membership-grid',
    templateUrl: 'membership.component.html',
    providers: [ParentChildRegistry, MembershipGridColumnsBuilder, PolicySubscriber]
})
export class MembershipGridComponent extends BaseGridViewModel<UserTeamProxyDTO> {
    @Input()
    public set user(value: UserDTO) {
        this._user = value;
        this.refreshGrid();
    }

    private _user: UserDTO;
    private _gridColumnsBuilder: IGridColumnsBuilder;

    constructor(injector: Injector, gridColumnsBuilder: MembershipGridColumnsBuilder) {
        super(injector);
        this._gridColumnsBuilder = gridColumnsBuilder;
    }

    public loadData(): Promise<void> {
        this.gridOptions = this.getGridOptions();
        return Promise.resolve();
    }

    protected getGridColumnsBuilder(): IGridColumnsBuilder {
        return this._gridColumnsBuilder;
    }

    protected loadItems(): UserTeamProxyDTO[] {
        return this._user.UserTeams || [];
    }

    protected setGridTitle(): string {
        return '';
    }

    protected getRowNodeId(data: UserTeamProxyDTO): any {
        return data.TeamId;
    }
}
