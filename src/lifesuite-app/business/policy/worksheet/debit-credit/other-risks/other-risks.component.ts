import { Component, Injector, Injectable } from '@angular/core';
import {
    RowManagementDelegate,
    MasterDetailComponentResolver,
    BaseDataManager,
    CreateItemEventData
} from 'life-core/component/master-detail';
import { IMessagingService, MessagingService } from 'life-core/messaging';
import { ResolvedDataNames } from 'life-core/view-model/data-resolver';
import { IGridColumnsBuilder } from 'life-core/component/grid';
import { DirectDataResolve } from 'life-core/component/shared';
import { I18n } from 'life-core/i18n';

import { InsuredDTO, WorksheetRowDTO, PolicyDTO } from 'ls-core/model';
import { DefaultDataService, SetDefaultDataRequest } from 'ls-core/service';
import { PolicySubscriber } from 'ls-core/session';

import { BasePolicyMasterDetailViewModel } from 'business/policy/shared';
import { ActiveApplicantHelper, ApplicantListHelper, DebitCreditHelper } from 'business/policy/shared';

import { OtherRisksGridColumnsBuilder } from './other-risks-grid-columns.builder';
import { OtherRisksItemFactory, OtherRisksCreateItemParams } from './other-risks-item-factory';
import { OtherRisksDialogDetailEditor } from './detail/other-risks-detail-editor';
import { DebitCreditsChannels } from '../debit-credit-channels';
import { OtherRisksDialogMetaDataResolver } from './detail/other-risks-dialog-metadata.resolver';

export function rowManagementDelegateFactory(
    itemFactory: OtherRisksItemFactory,
    dataManager: BaseDataManager<WorksheetRowDTO>
): RowManagementDelegate<WorksheetRowDTO> {
    return new RowManagementDelegate({
        itemName: 'OtherRisks',
        itemIDPropertyName: 'CoveragePersonWorksheetId',
        itemFactory: itemFactory,
        dataManager: dataManager
    });
}

export function itemComponentResolverFactory(): MasterDetailComponentResolver<WorksheetRowDTO> {
    return new MasterDetailComponentResolver({
        itemComponents: OtherRisksDialogDetailEditor
    });
}

@Component({
    selector: 'other-risks',
    templateUrl: './other-risks.component.html',
    providers: [
        BaseDataManager,
        OtherRisksItemFactory,
        PolicySubscriber,
        {
            provide: RowManagementDelegate,
            useFactory: rowManagementDelegateFactory,
            deps: [OtherRisksItemFactory, BaseDataManager]
        },
        {
            provide: MasterDetailComponentResolver,
            useFactory: itemComponentResolverFactory
        },
        OtherRisksGridColumnsBuilder
    ]
})
@Injectable()
export class OtherRisksComponent extends BasePolicyMasterDetailViewModel<WorksheetRowDTO> {
    private _insured: InsuredDTO;
    private _debitCreditHelper: DebitCreditHelper;
    private _applicantListHelper: ApplicantListHelper;
    private _messagingService: IMessagingService;
    private _defaultDataService: DefaultDataService;
    public policy: PolicyDTO;
    public applicantOtherRiskTotalPoints: number;
    public selectedApplicantId: number;
    private _gridColumnBuilder: OtherRisksGridColumnsBuilder;

    constructor(
        injector: Injector,
        policySubscriber: PolicySubscriber,
        defaultDataService: DefaultDataService,
        debitCreditHelper: DebitCreditHelper,
        activeApplicantHelper: ActiveApplicantHelper,
        applicantListHelper: ApplicantListHelper,
        messagingService: MessagingService,
        gridColumnBuilder: OtherRisksGridColumnsBuilder,
        i18n: I18n
    ) {
        super(injector);
        this.i18n = i18n;
        policySubscriber.subscribe(this, p => {
            this.policy = p;
        });
        this._defaultDataService = defaultDataService;
        this._debitCreditHelper = debitCreditHelper;
        this._messagingService = messagingService;
        this._applicantListHelper = applicantListHelper;

        this.subscriptionTracker.track(
            activeApplicantHelper.activeApplicantIdObservable.subscribe(applicantId => {
                this.setApplicant();
                this.refreshMasterDetail();
            })
        );
        this._gridColumnBuilder = gridColumnBuilder;
    }

    public get showDetailAsPopup(): boolean {
        return true;
    }

    public loadData(): Promise<void> {
        this.setResolvedMetaData();
        this.setApplicantPoints();
        return Promise.resolve(null);
    }

    protected getGridColumnsBuilder(): IGridColumnsBuilder {
        return this._gridColumnBuilder;
    }

    protected getTitle(): string {
        return this.i18n({ value: 'Other Risks', id: 'policy.worksheet.debitcredit.otherrisks' });
    }

    protected loadItems(): WorksheetRowDTO[] {
        return this._insured.Coverages_LazyLoad[0].WorksheetRows_LazyLoad;
    }

    protected initRowManagementDelegate(): void {
        this.rowManagementDelegate.initDataManager(this.items, item => this.worksheetRowFilter(item));
    }

    protected getItemDetailDialogResolve(item: WorksheetRowDTO): DirectDataResolve[] {
        return [
            { resolveName: ResolvedDataNames.metaData, resolverClass: OtherRisksDialogMetaDataResolver, context: item }
        ];
    }

    protected createItem(eventData: CreateItemEventData): Promise<WorksheetRowDTO> {
        const worksheetRow: WorksheetRowDTO = this.rowManagementDelegate.addNewRow({
            items: this.items,
            coveragePersonId: this._insured.Coverages_LazyLoad[0].CoveragePersonId
        } as OtherRisksCreateItemParams<WorksheetRowDTO>);
        const defaultDataRequest = new SetDefaultDataRequest(this.policy, worksheetRow, '');
        return this._defaultDataService.setDefaultData(defaultDataRequest).then(data => {
            Object.assign(worksheetRow, data.workingDTO as WorksheetRowDTO);
            return worksheetRow;
        });
    }

    protected getRowNodeId(data: WorksheetRowDTO): Object {
        return data.CoveragePersonWorksheetId;
    }

    protected removeItem(item: WorksheetRowDTO): Promise<boolean> {
        return super.removeItem(item).then(result => {
            if (result) {
                this._messagingService.publish(DebitCreditsChannels.DebitCredits);
                this.getMasterDetail().master.clearSelection();
                this.setApplicantPoints();
                return result;
            }
        });
    }

    protected onItemDetailDialogOKClick(item: WorksheetRowDTO, dialogDirty: boolean): void {
        super.onItemDetailDialogOKClick(item, dialogDirty);
        this.getMasterDetail().master.clearSelection();
        this._messagingService.publish(DebitCreditsChannels.DebitCredits);
        this.setApplicantPoints();
    }

    protected refreshMasterDetail(): void {
        super.refreshMasterDetail();
        this.setApplicantPoints();
    }

    private setApplicantPoints(): void {
        this.applicantOtherRiskTotalPoints = this._debitCreditHelper.getOtherRiskPoints(this._insured, true);
    }

    private setApplicant(): void {
        this._insured = this._applicantListHelper.getActiveApplicantOrDefault(this.policy.Insureds_LazyLoad);
    }

    private worksheetRowFilter(worksheetRow: WorksheetRowDTO): boolean {
        return !worksheetRow.OriginCode || !worksheetRow.OriginCode.trim();
    }
}
