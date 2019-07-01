import { Component, Injector } from '@angular/core';

import { RowManagementDelegate, MasterDetailComponentResolver, BaseDataManager } from 'life-core/component/master-detail';
import { IGridColumnsBuilder } from 'life-core/component/grid';
import { DirectDataResolve } from 'life-core/component/shared';
import { DialogSize } from 'life-core/component/dialog';
import { AuthorizationProvider } from 'life-core/authorization';
import { I18n } from 'life-core/i18n';

import { InsuredDTO, FamilyHistoryDTO, PolicyDTO } from 'ls-core/model';
import { PolicySubscriber } from 'ls-core/session';

import { BasePolicyMasterDetailViewModel, ApplicantListHelper } from 'business/policy/shared';
import { FamilyHistoryGridColumnsBuilder } from './family-history-grid-column.builder';
import { FamilyHistoryItemFactory } from './family-history-item-factory';
import { FamilyHistoryDialogDataResolver } from './detail/family-history-dialog-data.resolver';
import { FamilyHistoryDialogDetailEditor } from './detail/family-history-detail-editor';
import { FamilyHistoryAuthorizationProvider } from './family-history-authorization.provider';

export function rowManagementDelegateFactory(
    itemFactory: FamilyHistoryItemFactory,
    dataManager: BaseDataManager<FamilyHistoryDTO>
): RowManagementDelegate<FamilyHistoryDTO> {
    return new RowManagementDelegate({
        itemName: 'Family History',
        itemIDPropertyName: 'FamilyHistoryId',
        itemFactory: itemFactory,
        dataManager: dataManager
    });
}

export function itemComponentResolverFactory(): MasterDetailComponentResolver<FamilyHistoryDTO> {
    return new MasterDetailComponentResolver({
        itemComponents: FamilyHistoryDialogDetailEditor
    });
}

@Component({
    selector: 'family-history',
    templateUrl: './family-history.component.html',
    providers: [
        PolicySubscriber,
        BaseDataManager,
        FamilyHistoryItemFactory,
        {
            provide: RowManagementDelegate,
            useFactory: rowManagementDelegateFactory,
            deps: [FamilyHistoryItemFactory, BaseDataManager]
        },
        {
            provide: MasterDetailComponentResolver,
            useFactory: itemComponentResolverFactory
        },
        FamilyHistoryGridColumnsBuilder,
        { provide: AuthorizationProvider, useClass: FamilyHistoryAuthorizationProvider }
    ]
})
export class FamilyHistoryComponent extends BasePolicyMasterDetailViewModel<FamilyHistoryDTO> {
    public applicant: InsuredDTO;
    private _applicantListHelper: ApplicantListHelper;
    private _policy: PolicyDTO;

    private _gridColumnsBuilder: FamilyHistoryGridColumnsBuilder;

    constructor(
        injector: Injector,
        gridColumnsBuilder: FamilyHistoryGridColumnsBuilder,
        policySubscriber: PolicySubscriber,
        applicantListHelper: ApplicantListHelper,
        i18n: I18n
    ) {
        super(injector);
        this.i18n = i18n;
        this._gridColumnsBuilder = gridColumnsBuilder;
        this._applicantListHelper = applicantListHelper;
        policySubscriber.subscribe(this, policy => {
            this._policy = policy;
        });
    }

    public loadData(): Promise<void> {
        this.setResolvedListData();
        this.setApplicant();
        return Promise.resolve();
    }

    private setApplicant(): void {
        this.applicant = this._applicantListHelper.getActiveApplicantOrDefault(this._policy.Insureds_LazyLoad);
    }

    public get showDetailAsPopup(): boolean {
        return true;
    }

    protected getGridColumnsBuilder(): IGridColumnsBuilder {
        return this._gridColumnsBuilder;
    }

    protected loadItems(): FamilyHistoryDTO[] {
        return this.applicant.Applications_LazyLoad[0].FamilyHistories_LazyLoad;
    }

    protected getRowNodeId(data: FamilyHistoryDTO): Object {
        return data.FamilyHistoryId;
    }

    protected getItemDetailDialogResolve(item: FamilyHistoryDTO): DirectDataResolve[] {
        return [
            {
                resolveName: 'listData',
                resolverClass: FamilyHistoryDialogDataResolver,
                context: item
            }
        ];
    }

    protected getItemDetailDialogSize(): DialogSize {
        return DialogSize.large;
    }

    protected getTitle(): string {
        return this.i18n({ value: 'Family History', id: 'policy.case.familyHistory.title' });
    }
}
