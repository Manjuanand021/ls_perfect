import { Component, Injector } from '@angular/core';

import {
    RowManagementDelegate,
    MasterDetailComponentResolver,
    BaseDataManager,
    MasterButton,
    MasterButtonType
} from 'life-core/component/master-detail';
import { IGridColumnsBuilder } from 'life-core/component/grid';
import { ResolvedDataNames } from 'life-core/view-model';
import { DirectDataResolve, DialogSize } from 'life-core/component';
import { I18n } from 'life-core/i18n';

import { ApplicantQuestionDTO, InsuredDTO, PolicyDTO } from 'ls-core/model';
import { PolicySubscriber } from 'ls-core/session';

import { BasePolicyMasterDetailViewModel, ApplicantListHelper } from 'business/policy/shared';
import { ApplicantFormsItemFactory } from './applicant-forms-item-factory';
import { ApplicantFormsGridColumnsBuilder } from './applicant-forms-grid-column.builder';
import { ApplicantFormsDialogDetailEditor } from './detail/applicant-forms-dialog-detail-editor.component';
import { ApplicantFormsMetaDataResolver } from 'business/policy/applicant/forms/applicant-forms-metadata.resolver';

export function rowManagementDelegateFactory(
    itemFactory: ApplicantFormsItemFactory,
    dataManager: BaseDataManager<ApplicantQuestionDTO>
): RowManagementDelegate<ApplicantQuestionDTO> {
    return new RowManagementDelegate({
        itemName: 'applicantQuestion',
        itemIDPropertyName: 'QuestionId',
        itemFactory: itemFactory,
        dataManager: dataManager
    });
}

export function itemComponentResolverFactory(): MasterDetailComponentResolver<ApplicantQuestionDTO> {
    return new MasterDetailComponentResolver({
        itemComponents: ApplicantFormsDialogDetailEditor
    });
}

@Component({
    selector: 'applicant-forms',
    templateUrl: './applicant-forms.component.html',
    providers: [
        PolicySubscriber,
        BaseDataManager,
        ApplicantFormsItemFactory,
        {
            provide: RowManagementDelegate,
            useFactory: rowManagementDelegateFactory,
            deps: [ApplicantFormsItemFactory, BaseDataManager]
        },
        {
            provide: MasterDetailComponentResolver,
            useFactory: itemComponentResolverFactory
        },
        ApplicantFormsGridColumnsBuilder
    ]
})
export class ApplicantFormsComponent extends BasePolicyMasterDetailViewModel<ApplicantQuestionDTO> {
    public applicant: InsuredDTO;
    private _policy: PolicyDTO;
    private _applicantListHelper: ApplicantListHelper;
    private _gridColumnsBuilder: ApplicantFormsGridColumnsBuilder;

    constructor(
        injector: Injector,
        gridColumnsBuilder: ApplicantFormsGridColumnsBuilder,
        policySubscriber: PolicySubscriber,
        applicantListHelper: ApplicantListHelper,
        i18n: I18n
    ) {
        super(injector);
        this.i18n = i18n;
        this._applicantListHelper = applicantListHelper;
        this._gridColumnsBuilder = gridColumnsBuilder;
        policySubscriber.subscribe(this, policy => {
            this._policy = policy;
        });
    }

    public loadData(): Promise<void> {
        this.setResolvedMetaData();
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

    protected loadItems(): ApplicantQuestionDTO[] {
        return this.applicant.ApplicantQuestions;
    }

    protected getRowNodeId(data: ApplicantQuestionDTO): any {
        return data.QuestionId;
    }

    protected getItemDetailDialogResolve(item: ApplicantQuestionDTO): DirectDataResolve[] {
        return [
            { resolveName: ResolvedDataNames.metaData, resolverClass: ApplicantFormsMetaDataResolver, context: item }
        ];
    }

    protected getItemDetailDialogSize(): DialogSize {
        return DialogSize.large;
    }

    protected getTitle(): string {
        return this.i18n({ value: 'Forms', id: 'policy.case.forms.title' });
    }

    protected getRemoveItemMessage(): string {
        return '';
    }

    protected getPopupDetailButtons(): MasterButton<ApplicantQuestionDTO>[] {
        return [new MasterButton({ type: MasterButtonType.EDIT })];
    }
}
