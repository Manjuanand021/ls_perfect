import { Component, Injector } from '@angular/core';

import {
    MasterButton,
    BaseDataManager,
    RowManagementDelegate,
    MasterDetailComponentResolver
} from 'life-core/component/master-detail';
import { IGridColumnsBuilder } from 'life-core/component/grid';
import { AuthorizationProvider } from 'life-core/authorization';

import { PolicyDTO, MVRDTO } from 'ls-core/model';
import { PolicySubscriber } from 'ls-core/session';

import { BasePolicyMasterDetailViewModel, ApplicantListHelper } from 'business/policy/shared';
import { MVRItemFactory } from './mvr-item-factory';
import { MVRGridColumnsBuilder } from './mvr-grid-columns.builder';
import { MVRDetailComponent } from './detail';
import { MvrAuthorizationProvider } from './mvr-authorization.provider';

export function mvrRowManagementDelegateFactory(
    itemFactory: MVRItemFactory,
    dataManager: BaseDataManager<MVRDTO>
): RowManagementDelegate<MVRDTO> {
    return new RowManagementDelegate({
        itemName: 'MVR',
        itemIDPropertyName: 'MvrHeaderId',
        itemFactory: itemFactory,
        dataManager: dataManager
    });
}

export function mvrItemComponentResolverFactory(): MasterDetailComponentResolver<MVRDTO> {
    return new MasterDetailComponentResolver({
        itemComponents: MVRDetailComponent
    });
}

@Component({
    selector: 'mvr',
    templateUrl: './mvr.component.html',
    providers: [
        BaseDataManager,
        PolicySubscriber,
        MVRItemFactory,
        {
            provide: RowManagementDelegate,
            useFactory: mvrRowManagementDelegateFactory,
            deps: [MVRItemFactory, BaseDataManager]
        },
        {
            provide: MasterDetailComponentResolver,
            useFactory: mvrItemComponentResolverFactory
        },
        MVRGridColumnsBuilder,
        { provide: AuthorizationProvider, useClass: MvrAuthorizationProvider }
    ]
})
export class MVRComponent extends BasePolicyMasterDetailViewModel<MVRDTO> {
    public policy: PolicyDTO;
    private _gridColumnsBuilder: IGridColumnsBuilder;
    private _applicantListHelper: ApplicantListHelper;

    constructor(
        injector: Injector,
        policySubscriber: PolicySubscriber,
        gridColumnBuilder: MVRGridColumnsBuilder,
        applicantListHelper: ApplicantListHelper
    ) {
        super(injector);
        policySubscriber.subscribe(this, p => {
            this.policy = p;
        });
        this._gridColumnsBuilder = gridColumnBuilder;
        this._applicantListHelper = applicantListHelper;
    }

    public get showDetailAsPopup(): boolean {
        return false;
    }

    protected getInlineDetailButtons(): MasterButton<MVRDTO>[] {
        return [];
    }

    protected getGridColumnsBuilder(): IGridColumnsBuilder {
        return this._gridColumnsBuilder;
    }

    protected getRowNodeId(data: MVRDTO): any {
        return data.MvrHeaderId;
    }

    protected getRemoveItemMessage(item: MVRDTO): string {
        // need not return any message from the method
        // had to implement the method since it is an abstract in base class
        return '';
    }

    protected loadItems(): MVRDTO[] {
        const activeInsured = this._applicantListHelper.getActiveApplicantOrDefault(this.policy.Insureds_LazyLoad);
        return activeInsured.MVRs_LazyLoad;
    }
}
