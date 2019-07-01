import { Component, Injector, SkipSelf, Optional } from '@angular/core';

import { ObjectUtil, ConvertUtil } from 'life-core/util/lang';
import { SecondaryTabHostViewModel } from 'life-core/component/layout/tabview';
import { ListItem } from 'life-core/model';
import { IMessagingService, MessagingService } from 'life-core/messaging';
import { ListUtil, DateUtil } from 'life-core/util';
import {
    DialogButton,
    DialogButtonType,
    ModalDialog,
    DialogResult,
    ConfirmDialog,
    DialogSize
} from 'life-core/component';
import { AuthorizationProvider } from 'life-core/authorization';
import { I18n } from 'life-core/i18n';
import { IRowManagementDelegate, RowManagementDelegate } from 'life-core/component/master-detail';

import { PolicyDTO, RequirementDTO, AddressDTO, InsuredDTO, CountryFilterList } from 'ls-core/model';
import { ListDataService, ListDataRequestBuilder, ListsDataRequest, ListDataUtil, ListDataItems, ListDataItem, SetDefaultDataRequest, DefaultDataService } from 'ls-core/service';
import { MetadataLoader, DBDateUtil } from 'ls-core/util';
import { PolicySubscriber } from 'ls-core/session';

import {
    RequirementMatchComponent,
    RequirementMatchUnmatchChannels,
    MatchUnmatchType
} from 'business/policy/requirements/match';
import {
    ApplicantHelper,
    ApplicantListHelper,
    ApplicationCountersHelper,
    CountryStateCodes
} from 'business/policy/shared';
import { RequirementDetailContext, RequirementDetailContextModel } from './requirement-detail-context';
import { RequirementTypes } from './../requirement.type';
import { BasicInfoAuthorizationProvider } from './authorization/basic-info-authorization.provider';
import { RequirementStatuses } from '../../shared/requirement-statuses';
import { ViewValidationResult, ValidationRenderType } from 'life-core/view-model/validation';
import { RequirementDeactivateGuard } from '../requirement-deactivate.guard';

const REQUIREMENT_ORDEREDFROM_MANUAL = 'Manual';
const SYSTEM_ADDED = 'System';

enum RequirementDetailBasicControls {
    ACCOUNT_CODE = 'accountCode',
    APPLICANT = 'applicant',
    DL_NUMBER = 'dlNumber',
    DL_STATE = 'dlState',
    EXISTING_EVIDENCE = 'chkUseExistingEvidence',
    FOLLOWUP = 'followup',
    ORDERED_BY = 'orderedBy',
    ORDERED_DATE = 'orderedDate',
    ORDERED_FROM = 'orderedFrom',
    STATUS = 'status'
}

const FieldsDisabledForRequirementStatusMap = {
    // specifies the field for which requirement all statuses it's disabled
    [RequirementDetailBasicControls.ACCOUNT_CODE]: [
        RequirementStatuses.SATISFIED,
        RequirementStatuses.DELETED,
        RequirementStatuses.CANCELED,
        RequirementStatuses.WAIVED,
        RequirementStatuses.RECEIVED,
        RequirementStatuses.ORDERED
    ],

    [RequirementDetailBasicControls.APPLICANT]: [
        RequirementStatuses.OPEN,
        RequirementStatuses.SATISFIED,
        RequirementStatuses.CANCELED,
        RequirementStatuses.WAIVED,
        RequirementStatuses.RECEIVED,
        RequirementStatuses.ORDERED,
        RequirementStatuses.HOLD
    ],
    [RequirementDetailBasicControls.DL_NUMBER]: [
        RequirementStatuses.SATISFIED,
        RequirementStatuses.CANCELED,
        RequirementStatuses.WAIVED,
        RequirementStatuses.RECEIVED,
        RequirementStatuses.ORDERED,
        RequirementStatuses.DELETED
    ],
    [RequirementDetailBasicControls.DL_STATE]: [
        RequirementStatuses.SATISFIED,
        RequirementStatuses.CANCELED,
        RequirementStatuses.WAIVED,
        RequirementStatuses.RECEIVED,
        RequirementStatuses.ORDERED,
        RequirementStatuses.DELETED
    ],
    [RequirementDetailBasicControls.EXISTING_EVIDENCE]: [
        RequirementStatuses.OPEN,
        RequirementStatuses.SATISFIED,
        RequirementStatuses.CANCELED,
        RequirementStatuses.WAIVED,
        RequirementStatuses.RECEIVED,
        RequirementStatuses.ORDERED,
        RequirementStatuses.HOLD
    ],
    [RequirementDetailBasicControls.FOLLOWUP]: [
        RequirementStatuses.SATISFIED,
        RequirementStatuses.DELETED,
        RequirementStatuses.CANCELED,
        RequirementStatuses.WAIVED
    ],
    [RequirementDetailBasicControls.ORDERED_BY]: [
        RequirementStatuses.OPEN,
        RequirementStatuses.SATISFIED,
        RequirementStatuses.CANCELED,
        RequirementStatuses.WAIVED,
        RequirementStatuses.RECEIVED,
        RequirementStatuses.ORDERED,
        RequirementStatuses.HOLD
    ],
    [RequirementDetailBasicControls.ORDERED_FROM]: [
        RequirementStatuses.SATISFIED,
        RequirementStatuses.DELETED,
        RequirementStatuses.CANCELED,
        RequirementStatuses.WAIVED,
        RequirementStatuses.RECEIVED
    ],
    [RequirementDetailBasicControls.ORDERED_DATE]: [RequirementStatuses.SATISFIED],
    [RequirementDetailBasicControls.STATUS]: [
        RequirementStatuses.SATISFIED,
        RequirementStatuses.DELETED,
        RequirementStatuses.CANCELED,
        RequirementStatuses.WAIVED
    ]
};

@Component({
    selector: 'requirement-detail-basic-info',
    templateUrl: './requirement-detail-basic-info.component.html',
    providers: [PolicySubscriber, { provide: AuthorizationProvider, useClass: BasicInfoAuthorizationProvider }]
})
export class RequirementDetailBasicInfo extends SecondaryTabHostViewModel<RequirementDTO> {
    public isRequirementCodeMVR: boolean;
    public applicantList: Array<ListItem>;
    public addedByName: string = '';
    public isFollowedUp: boolean;
    public isMatchButtonAvailable: boolean;
    public isUnmatchButtonAvailable: boolean;
    public controlDisabledMap: { [controlName: string]: boolean };
    public countryId: string;
    private _applicant: InsuredDTO;
    private _policy: PolicyDTO;
    private _listDataService: ListDataService;
    private _metadataLoader: MetadataLoader;
    private _modalDialog: ModalDialog;
    private _confirmDialog: ConfirmDialog;
    private _messagingService: IMessagingService;
    private _applicantListHelper: ApplicantListHelper;
    private _requirementDetailContext: RequirementDetailContext;
    private _deactivateGuard: RequirementDeactivateGuard;
    private _rowManagementDelegate: IRowManagementDelegate<RequirementDTO>;
    private _requirementTypes: RequirementTypes;
    private _applicationCountersHelper: ApplicationCountersHelper;
    private _initialStatus: string;
    public reqStatus: string;
    private _defaultDataService: DefaultDataService;

    constructor(
        injector: Injector,
        policySubscriber: PolicySubscriber,
        applicantListHelper: ApplicantListHelper,
        requirementDetailContext: RequirementDetailContext,
        listDataService: ListDataService,
        metadataLoader: MetadataLoader,
        modalDialog: ModalDialog,
        confirmDialog: ConfirmDialog,
        messagingService: MessagingService,
        parentAuthProvider: AuthorizationProvider,
        @SkipSelf()
        @Optional()
        rowManagementDelegate: RowManagementDelegate<RequirementDTO>,
        requirementDeactivateGuard: RequirementDeactivateGuard,
        i18n: I18n,
        requirementTypes: RequirementTypes,
        applicationCountersHelper: ApplicationCountersHelper,
        defaultDataService: DefaultDataService
    ) {
        super(injector);
        this.i18n = i18n;
        this._listDataService = listDataService;
        this._metadataLoader = metadataLoader;
        this._modalDialog = modalDialog;
        this._confirmDialog = confirmDialog;
        this._messagingService = messagingService;
        policySubscriber.subscribe(this, p => {
            this._policy = p;
            this.setButtonsAvailability();
        });
        this._requirementDetailContext = requirementDetailContext;
        this._applicantListHelper = applicantListHelper;
        this.controlDisabledMap = {};
        this.registerHandlers();
        this._deactivateGuard = requirementDeactivateGuard;
        this._rowManagementDelegate = rowManagementDelegate;
        this.handleNewRequirementFields();
        this._requirementTypes = requirementTypes;
        this._applicationCountersHelper = applicationCountersHelper;
        this._defaultDataService = defaultDataService;
    }

    public registerHandlers(): void {
        this.subscriptionTracker.track(
            this._requirementDetailContext.contextObservable.subscribe(context => {
                this.setContext(context);
            })
        );
    }

    public onIsFollowedUpChange(value: any): void {
        if (value) {
            const currentDate = DateUtil.truncateTimeFromDate(new Date());
            this.data.FollowupDate = DBDateUtil.dateToDBDate(currentDate);
        } else {
            this.data.FollowupDate = null;
        }
        this.isFollowedUp = value;
    }

    public onMatchClick(): void {
        this.openRequirementMatchDialog();
    }

    public onOrderByChange(): void {
        this.loadListData();
		this.changeManager.setIsDirty(true);
    }

    public onOrderFromChange(): void {
        this.resetAccountCode();
        this.loadListData();
        this.loadAndAssignEvidenceTypeMetadata();
    }

    private loadAndAssignEvidenceTypeMetadata(): Promise<void> {
        const reqProv = 'requirement_provider_' + this.data.RequirementCode;
        return this._metadataLoader.load([reqProv]).then(data => {
            this.setListData(data);
            var evidencyTypeList: Array<ListDataItem> = ListDataUtil.convertToListDataItemArray(this.listData[reqProv]);
            this.data.EvidenceType = ListDataUtil.getExternalCodeFromListDataById(evidencyTypeList,this.data.Provider);
        });
    }

    public onStatusChange(selectedStatus: any): void {
        if (selectedStatus.value == RequirementStatuses.SATISFIED) {
            this.setFollowupFieldAvailability(true);
        } else if (selectedStatus.value == RequirementStatuses.OPEN) {
            this.setFollowupFieldAvailability(false);
        }
        else if (selectedStatus.value == RequirementStatuses.ORDERED) {
            this.isFollowedUp = true;
            const reqDTO: RequirementDTO = new RequirementDTO();
            const defaultDataRequest = new SetDefaultDataRequest(this._policy, this.data, '');
            this._defaultDataService.setDefaultData(defaultDataRequest).then(data => {
                                Object.assign(reqDTO, data.workingDTO as RequirementDTO);
                                this.data.FollowupDate = reqDTO.FollowupDate;
            });
        }
        if (!this.data._counterIncreased) {
            this._applicationCountersHelper.incrementManualActionCounter(this._policy);
            this.data._counterIncreased = true;
        } else if (selectedStatus.value == this._initialStatus) {
            this._applicationCountersHelper.decrementManualActionCounter(this._policy);
            this.data._counterIncreased = false;
        }
        this.setReqStatus();
		this.changeManager.setIsDirty(true);
    }

    public onUnmatchClick(): void {
        this.confirmUnmatchRequirement().then(dialogRef => {
            if (dialogRef.buttonId === DialogButtonType.YES) {
                this.changeManager.setIsDirty(true);
                this.data.RequirementInformationId = null;
                this.publishUnmatchSelection();
            }
        });
    }

    public onDLDataChange(): void {
        this._applicant.Applications_LazyLoad[0].DriversLicenseCountryId = this.countryId;
        this._applicant.Applications_LazyLoad[0].DriversLicenseState = this.data.DLState;
        this._applicant.Applications_LazyLoad[0].DriversLicenseNumber = this.data.DLNumber;
    }

    public setFollowupFieldAvailability(isDisabled: boolean): void {
        this.isFollowedUp = !isDisabled;
        this.disableControl(RequirementDetailBasicControls.FOLLOWUP, isDisabled);
    }

    public doCustomValidation(validationRenderType: ValidationRenderType): ViewValidationResult {
        return this._deactivateGuard.isProviderInfoValid(this.data, validationRenderType != ValidationRenderType.never)
            ? ViewValidationResult.pass
            : ViewValidationResult.fail;
    }

    private setContext(context: RequirementDetailContextModel): void {
        this.data = context.requirement;
        this.loadListData();
        this.getReqStatus();
        this.loadMetadata();
        this.setAddedByName();
        this.setFollowedUp();
        this.setButtonsAvailability();
        this.setDLDetailsAvailability();
        this.getApplicant();
        this.loadApplicantList();
        this.setControlsAvailability();
        this.setDefaultApplicant();
        this._initialStatus = this.reqStatus;
    }

    private loadListData(): Promise<void> {
        const request = this.getListsDataRequest();
        return this._listDataService.load(request).then(data => {
            this.setListData(data);
            this.setDefaultProvider();
            this.setOrderedDetailsDisability();
            this.handleNewRequirementFields();
            this.getFilteredCountryList();
        });
    }

    private setDefaultProvider(): void {
        if (!this.data.Provider) {
            this.data.Provider = ListDataUtil.getFirstOrDefaultListItemValue(this.listData.Provider);
            if (this.data.Provider) {
                this.loadListData();
            }
        }
    }

    private setReqStatus():void{
        this.data.ClosedDisposition = this.reqStatus;
    }

    private getReqStatus():void{
        this.reqStatus = (this.data.ClosedDisposition ==null || this.data.ClosedDisposition =='') ? 'O' : this.data.ClosedDisposition;
    }

    private setOrderedDetailsDisability(): void {
        this.disableControl(
            RequirementDetailBasicControls.ORDERED_BY,
            this.data.Provider != REQUIREMENT_ORDEREDFROM_MANUAL
        );
        this.disableControl(
            RequirementDetailBasicControls.ORDERED_DATE,
            this.data.Provider != REQUIREMENT_ORDEREDFROM_MANUAL
        );
    }

    private handleNewRequirementFields(): void {
        if (this._rowManagementDelegate.isNewItem()) {
            this.disableControl(RequirementDetailBasicControls.ORDERED_BY, false);
            this.disableControl(RequirementDetailBasicControls.APPLICANT, false);
        }
    }

    private setAddedByName(): void {
        if (this.data.AddedBy) {
            this.addedByName =
                ConvertUtil.toNumber(this.data.AddedBy) == -255
                    ? SYSTEM_ADDED
                    : ListUtil.getLabelByValue(this.listData.aus_users, this.data.AddedBy.toString());
        }
    }

    private setFollowedUp(): void {
        this.isFollowedUp = false;
        if (this.data.FollowupDate != null && this.data.FollowupDate.dateAsString !== '') {
            this.isFollowedUp = DateUtil.isDateSet(this.data.FollowupDate.datetime) ? true : this.isFollowedUp;
        }
    }

    private setButtonsAvailability(): any {
        this.isMatchButtonAvailable = this.data.supportsMatch && this.data.RequirementInformationId == null;
        this.isUnmatchButtonAvailable = this.data.supportsMatch && !this.isMatchButtonAvailable;
    }

    private setDLDetailsAvailability(): void {
        this.isRequirementCodeMVR = this.data.RequirementCode === 'MVR';
    }

    private getApplicant(): void {
        this._applicant = this._applicantListHelper.getActiveApplicantOrDefault(this._policy.Insureds_LazyLoad);
    }

    private loadApplicantList(): void {
        let applicantName: string;
        this.applicantList = new Array<ListItem>();
        this._policy.Insureds_LazyLoad.forEach(applicant => {
            applicantName = ApplicantHelper.getApplicantFullName(applicant);
            this.applicantList.push(
                new ListItem(applicantName, applicant.PolicyPersonId ? applicant.PolicyPersonId.toString() : '')
            );
        });
    }

    private setControlsAvailability(): void {
        Object.keys(RequirementDetailBasicControls).forEach(key => {
            const field = RequirementDetailBasicControls[key];
            this.isFieldDisabledBasedOnRequirementStatus(field)
                ? this.disableControl(field, true)
                : this.disableControl(field, false);
        });
    }

    private setDefaultApplicant(): void {
        if (!this.data.PolicyPersonId) {
            this.data.PolicyPersonId = this._applicant.PolicyPersonId;
        }
    }

    private setDLData(): void {
        if (this.isRequirementCodeMVR) {
            this.countryId = this._applicant.Applications_LazyLoad[0].DriversLicenseCountryId;
            this.data.DLState = this._applicant.Applications_LazyLoad[0].DriversLicenseState;
            this.data.DLNumber = this._applicant.Applications_LazyLoad[0].DriversLicenseNumber;
        }
    }

    private resetAccountCode(): void {
        this.data.AccountCode = '';
    }

    private getListsDataRequest(): ListsDataRequest {
        const listDataRequestBuilder = new ListDataRequestBuilder();
        listDataRequestBuilder.setRootDTO(this._policy);
        const requirementDTO = ObjectUtil.createObjectOfType(this.data, RequirementDTO);
        const addressDTO = new AddressDTO();
        listDataRequestBuilder.addListRequestItem(requirementDTO, 'RequirementCode');
        listDataRequestBuilder.addListRequestItem(requirementDTO, 'ClosedDisposition');
        listDataRequestBuilder.addListRequestItem(requirementDTO, 'OrderedBy');
        listDataRequestBuilder.addListRequestItem(requirementDTO, 'Provider');
        listDataRequestBuilder.addListRequestItem(requirementDTO, 'AccountCode');
        listDataRequestBuilder.addListRequestItem(addressDTO, 'CountryStateId');
        listDataRequestBuilder.addListRequestItem(addressDTO, 'CountryId');
        return listDataRequestBuilder.getRequest();
    }

    private loadMetadata(): Promise<void> {
        return this._metadataLoader.load(['aus_users', ...CountryStateCodes]).then(data => {
            this.setAddedByName();
            this.setListData(data);
            this.setDLData();
        });
    }

    private getFilteredCountryList(): void {
        this.listData.CountryId = this.listData.CountryId.filter(
            country => CountryFilterList.indexOf(country.Id) != -1
        );
    }

    private openRequirementMatchDialog(): void {
        this._modalDialog.open({
            view: RequirementMatchComponent,
            title: this.getRequirementMatchDialogTitle(),
            buttons: [
                new DialogButton({ type: DialogButtonType.ACCEPT }),
                new DialogButton({
                    type: DialogButtonType.CANCEL,
                    options: { isDefault: true }
                })
            ],
            data: this.data,
            size: DialogSize.large
        });
    }

    private getRequirementMatchDialogTitle(): string {
        return this.data.requirementType === this._requirementTypes.mvr
            ? this.i18n({ value: 'Manual Match MVR', id: 'policy.matching.mvr.title' })
            : this.i18n({ value: 'Manual Match Lab', id: 'policy.matching.lab.title' });
    }

    private confirmUnmatchRequirement(): Promise<DialogResult> {
        return this._confirmDialog.open({
            message: this.i18n(
                {
                    value: 'Are you sure you want to Unmatch the {{requirementType}}',
                    id: 'policy.requirement.dialog.umatch.message'
                },
                { requirementType: this.data.requirementType }
            ),
            title: this.data.requirementType === 'MVR' ? this._requirementTypes.mvr : this._requirementTypes.lab,
            buttons: [new DialogButton({ type: DialogButtonType.YES }), new DialogButton({ type: DialogButtonType.NO })]
        });
    }

    private publishUnmatchSelection(): void {
        const requirement = this._policy.Requirements_LazyLoad.find(
            requirements => requirements.RequirementCode === this.data.RequirementCode
        );
        requirement.RequirementInformationId = this.data.RequirementInformationId;
        this._messagingService.publish(RequirementMatchUnmatchChannels.RequirementMatchUnmatch, {
            requirement: requirement,
            matchUnmatchType: MatchUnmatchType.Unmatch
        });
    }

    private disableControl(control: string, isDisabled: boolean): void {
        this.controlDisabledMap[control] = isDisabled;
    }

    private isFieldDisabledBasedOnRequirementStatus(field: string): boolean {
        return (
            FieldsDisabledForRequirementStatusMap[field].find(
                status => status == this.reqStatus.toUpperCase()
            ) != undefined
        );
    }
}
