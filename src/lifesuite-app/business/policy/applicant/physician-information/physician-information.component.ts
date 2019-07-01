import { Component, Injector } from '@angular/core';
import { ResolvedDataNames } from 'life-core/view-model';

import {
    RowManagementDelegate,
    MasterDetailComponentResolver,
    BaseDataManager
} from 'life-core/component/master-detail';
import { IGridColumnsBuilder } from 'life-core/component/grid';
import { DirectDataResolve } from 'life-core/component/shared';
import { DialogSize } from 'life-core/component/dialog';
import { I18n } from 'life-core/i18n';
import { ICancelableDataManager } from 'life-core/data-management';

import { InsuredDTO, PartyRelationDTO, PolicyDTO } from 'ls-core/model';
import { PolicySubscriber } from 'ls-core/session';

import { BasePolicyMasterDetailViewModel, ApplicantListHelper } from 'business/policy/shared';
import { PhysicianInformationGridColumnsBuilder } from './physician-information-grid-column.builder';
import { PhysicianInformationItemFactory } from './physician-information-item-factory';
import { PhysicianInformationDialogDataResolver } from './detail/physician-information-dialog-data.resolver';
import { PhysicianInformationDialogDetailEditor } from './detail/physician-information-detail-editor';
import { PhysicianInformationDialogMetaDataResolver } from './detail/physician-information-dialog-meta-data.resolver';

export function rowManagementDelegateFactory(
    itemFactory: PhysicianInformationItemFactory,
    dataManager: BaseDataManager<PartyRelationDTO>
): RowManagementDelegate<PartyRelationDTO> {
    return new RowManagementDelegate({
        itemName: 'Physician Information',
        itemIDPropertyName: 'PersonId',
        itemFactory: itemFactory,
        dataManager: dataManager
    });
}

export function itemComponentResolverFactory(): MasterDetailComponentResolver<PartyRelationDTO> {
    return new MasterDetailComponentResolver({
        itemComponents: PhysicianInformationDialogDetailEditor
    });
}

@Component({
    selector: 'physician-information',
    templateUrl: './physician-information.component.html',
    providers: [
        PolicySubscriber,
        BaseDataManager,
        PhysicianInformationItemFactory,
        {
            provide: RowManagementDelegate,
            useFactory: rowManagementDelegateFactory,
            deps: [PhysicianInformationItemFactory, BaseDataManager]
        },
        {
            provide: MasterDetailComponentResolver,
            useFactory: itemComponentResolverFactory
        },
        PhysicianInformationGridColumnsBuilder
    ]
})
export class PhysicianInformationComponent extends BasePolicyMasterDetailViewModel<PartyRelationDTO> {
    public applicant: InsuredDTO;
    private _applicantListHelper: ApplicantListHelper;
    private _policy: PolicyDTO;
    private _gridColumnsBuilder: PhysicianInformationGridColumnsBuilder;
    private _cancelableDataManager: ICancelableDataManager<PartyRelationDTO>;

    constructor(
        injector: Injector,
        gridColumnsBuilder: PhysicianInformationGridColumnsBuilder,
        policySubscriber: PolicySubscriber,
        applicantListHelper: ApplicantListHelper,
        i18n: I18n
    ) {
        super(injector);
        this.i18n = i18n;
        this._applicantListHelper = applicantListHelper;
        policySubscriber.subscribe(this, policy => {
            this._policy = policy;
        });
        this._gridColumnsBuilder = gridColumnsBuilder;
    }

    public loadData(): Promise<void> {
        this.setResolvedMetaData();
        this.setApplicant();
        this.setResolvedListData();
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

    protected loadItems(): PartyRelationDTO[] {
        return this.applicant.Relations_LazyLoad;
    }

    protected getRowNodeId(data: PartyRelationDTO): any {
        return data.PersonId;
    }

    protected showItemDetailDialog(item: PartyRelationDTO): Promise<PartyRelationDTO> {
        return super.showItemDetailDialog(item);
    }

    protected getItemDetailDialogResolve(item: PartyRelationDTO): DirectDataResolve[] {
        return [
            {
                resolveName: ResolvedDataNames.listData,
                resolverClass: PhysicianInformationDialogDataResolver,
                context: item
            },
            {
                resolveName: ResolvedDataNames.metaData,
                resolverClass: PhysicianInformationDialogMetaDataResolver,
                context: item
            }
        ];
    }

    protected getItemDetailDialogSize(): DialogSize {
        return DialogSize.large;
    }

    protected getTitle(): string {
        return this.i18n({ value: 'Physician Information', id: 'policy.case.physician.title' });
    }
}
