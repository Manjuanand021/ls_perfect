import { Component, Injector, Injectable } from '@angular/core';

import {
    RowManagementDelegate,
    MasterDetailComponentResolver,
    BaseDataManager,
    MasterButton,
    MasterButtonType
} from 'life-core/component/master-detail';
import { IGridColumnsBuilder } from 'life-core/component/grid';
import { DirectDataResolve } from 'life-core/component/shared';
import { DialogSize, CreateItemEventData } from 'life-core/component';
import { I18n } from 'life-core/i18n';

import { InsuredDTO, RelatedPolicyDTO, PolicyDTO } from 'ls-core/model';
import { PolicySubscriber } from 'ls-core/session';

import { BasePolicyMasterDetailViewModel, ApplicantListHelper } from 'business/policy/shared';
import { OtherInsuranceCasesGridColumnsBuilder } from './other-insurance-cases-grid-column.builder';
import { OtherInsuranceCasesItemFactory, RelatedPolicyCreateItemParams } from './other-insurance-cases-item-factory';
import { OtherInsuranceCasesDialogDataResolver } from './detail/other-insurance-cases-dialog-data.resolver';
import { OtherInsuranceCasesDialogDetailEditor } from './detail/other-insurance-cases-detail-editor';
import { SetDefaultDataRequest, DefaultDataService } from 'ls-core/service';

export function rowManagementDelegateFactory(
    itemFactory: OtherInsuranceCasesItemFactory,
    dataManager: BaseDataManager<RelatedPolicyDTO>
): RowManagementDelegate<RelatedPolicyDTO> {
    return new RowManagementDelegate({
        itemName: 'Other Insurance Cases And Policies',
        itemIDPropertyName: 'SequenceNumber',
        itemFactory: itemFactory,
        dataManager: dataManager
    });
}

export function itemComponentResolverFactory(): MasterDetailComponentResolver<RelatedPolicyDTO> {
    return new MasterDetailComponentResolver({
        itemComponents: OtherInsuranceCasesDialogDetailEditor
    });
}

@Component({
    selector: 'other-insurance-cases',
    templateUrl: './other-insurance-cases.component.html',
    providers: [
        PolicySubscriber,
        BaseDataManager,
        OtherInsuranceCasesItemFactory,
        {
            provide: RowManagementDelegate,
            useFactory: rowManagementDelegateFactory,
            deps: [OtherInsuranceCasesItemFactory, BaseDataManager]
        },
        {
            provide: MasterDetailComponentResolver,
            useFactory: itemComponentResolverFactory
        },
        OtherInsuranceCasesGridColumnsBuilder
    ]
})
@Injectable()
export class OtherInsuranceCasesComponent extends BasePolicyMasterDetailViewModel<RelatedPolicyDTO> {
    public applicant: InsuredDTO;
    private _applicantListHelper: ApplicantListHelper;
    private _policy: PolicyDTO;

    private _gridColumnsBuilder: OtherInsuranceCasesGridColumnsBuilder;
    private _defaultDataService: DefaultDataService;
    constructor(
        injector: Injector,
        gridColumnsBuilder: OtherInsuranceCasesGridColumnsBuilder,
        policySubscriber: PolicySubscriber,
        applicantListHelper: ApplicantListHelper,
        defaultDataService: DefaultDataService,
        i18n: I18n
    ) {
        super(injector);
        this.i18n = i18n;
        this._gridColumnsBuilder = gridColumnsBuilder;
        this._applicantListHelper = applicantListHelper;
        this._defaultDataService = defaultDataService;
        policySubscriber.subscribe(this, policy => {
            this._policy = policy;
        });
    }

    public loadData(): Promise<void> {
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

    protected loadItems(): RelatedPolicyDTO[] {
        return this.applicant.RelatedPolicies_LazyLoad;
    }

    protected getRowNodeId(data: RelatedPolicyDTO): Object {
        return data.SequenceNumber;
    }

    protected createItem(eventData: CreateItemEventData<RelatedPolicyDTO>): Promise<RelatedPolicyDTO> {
        const relatedPolicy: RelatedPolicyDTO = this.rowManagementDelegate.addNewRow({
            items: this.items,
            policyPersonId: this.getApplicantForNewRelatedPolicy()
        } as RelatedPolicyCreateItemParams<RelatedPolicyDTO>);
        const defaultDataRequest = new SetDefaultDataRequest(this._policy, relatedPolicy, '');
        return this._defaultDataService.setDefaultData(defaultDataRequest).then(data => {
            Object.assign(relatedPolicy, data.workingDTO as RelatedPolicyDTO);
            return relatedPolicy;
        });
        // return Promise.resolve(relatedPolicy);
    }

    protected getItemDetailDialogResolve(item: RelatedPolicyDTO): DirectDataResolve[] {
        return [
            {
                resolveName: 'listData',
                resolverClass: OtherInsuranceCasesDialogDataResolver,
                context: item
            }
        ];
    }

    protected getItemDetailDialogSize(): DialogSize {
        return DialogSize.large;
    }

    protected getTitle(): string {
        return this.i18n({ value: 'Other Insurance Cases And Policy', id: 'policy.case.otherInsurance.title' });
    }

    protected getPopupDetailButtons(): MasterButton<RelatedPolicyDTO>[] {
        return [new MasterButton({ type: MasterButtonType.ADD }), new MasterButton({ type: MasterButtonType.EDIT })];
    }

    private getApplicantForNewRelatedPolicy(): Object {
        return this.applicant.PolicyPersonId;
    }
}
