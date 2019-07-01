import { Component, Injector } from '@angular/core';

import { ViewModel } from 'life-core/view-model';
import { MessagingService } from 'life-core/messaging/messaging.service';
import { I18n } from 'life-core/i18n';
import { NameUtil } from 'life-core/util';
import { InputValueValidationResult } from 'life-core/view-model/validation/input-value';

import { PolicyDTO, InsuredDTO, PhoneDTO, PhoneTypes, AddressDTO, AddressTypes, DBDate } from 'ls-core/model';
import { PolicySubscriber } from 'ls-core/session/policy-subscriber';
import { AddressUtil, PhoneUtil } from 'ls-core/util/collection';
import { MetadataUtil, DBDateUtil } from 'ls-core/util';

import { ApplicantListHelper } from 'business/policy/shared';
import { ApplicantInfoHeaderBuilder } from './applicant-information-header.builder';
import { ApplicantChannel } from '../applicant-channel';
import { BirthDateValidatorDelegate } from './birthdate-validator.delegate';
import { ConfirmDialog, DialogResult, DialogButton, DialogButtonType } from 'life-core/component';

const maxUnderwritingAmount = 999999999999;

const hippaAuthorizationFlag = {
    yes: 1,
    no: 0
};

@Component({
    selector: 'applicant-information',
    templateUrl: './applicant-information.component.html',
    providers: [PolicySubscriber, ApplicantInfoHeaderBuilder, BirthDateValidatorDelegate]
})
export class ApplicantInformationComponent extends ViewModel {
    public applicant: InsuredDTO;
    public applicantPanelHeader: string;
    public homePhone: PhoneDTO;
    public workPhone: PhoneDTO;
    public cellPhone: PhoneDTO;
    public autoOrderValue: string;
    public residenceAddress: AddressDTO;
    public applications: Array<any>;
    public maxLengthOfPostalCode: number;
    public maxBirthDate: Date;
    public maxAdditionalUWAmount: number;

    private _policy: PolicyDTO;
    private _applicantListHelper: ApplicantListHelper;
    private _messagingService: MessagingService;
    private _updatedApplicantName: string;
    private _applicantInfoHeaderBuilder: ApplicantInfoHeaderBuilder;
    private _birthDateValidatorDelegate: BirthDateValidatorDelegate;
    private _confirmDialog: ConfirmDialog;
    constructor(
        injector: Injector,
        policySubscriber: PolicySubscriber,
        applicantListHelper: ApplicantListHelper,
        messagingService: MessagingService,
        applicantInfoHeaderBuilder: ApplicantInfoHeaderBuilder,
        i18n: I18n,
        birthDateValidatorDelegate: BirthDateValidatorDelegate,
        confirmDialog: ConfirmDialog
    ) {
        super(injector);
        this._applicantListHelper = applicantListHelper;
        policySubscriber.subscribe(this, policy => {
            this._policy = policy;
        });
        this._messagingService = messagingService;
        this.setBirthDateLimit();
        this._applicantInfoHeaderBuilder = applicantInfoHeaderBuilder;
        this.maxBirthDate = this.setBirthDateLimit();
        this.i18n = i18n;
        this._birthDateValidatorDelegate = birthDateValidatorDelegate;
        this._confirmDialog = confirmDialog;
    }

    public loadData(): Promise<void> {
        this.setApplicant();
        this.setupApplicantData();
        this.setResolvedListData();
        this.setResolvedMetaData();
        this.setPanelHeader();
        this.setApplicationsData();
        return Promise.resolve();
    }

    public onDLDataChange(): void {
        this._policy.Requirements_LazyLoad.forEach(requirement => {
            if (requirement.RequirementCode == 'MVR') {
                requirement.DLNumber = this.applicant.Applications_LazyLoad[0].DriversLicenseNumber;
                requirement.DLState = this.applicant.Applications_LazyLoad[0].DriversLicenseState;
            }
        });
    }

    public onApplicantBirthDateChange(): void {
        if (
            this.applicantBirthDateExists() &&
            this._birthDateValidatorDelegate.validate() === InputValueValidationResult.fail
        ) {
            this.showValidationMsgDialog().then(() => {
                this.resetOriginalBirthDate();
            });
        }
    }

    protected setupData(): void {
        this.setMaxUnderWritingAmount();
        this.setHippaAuthorizationFlag();
    }

    private setMaxUnderWritingAmount(): void {
        const underwritingAmount = this.applicant.UnderwritingAmount as number;
        const additionalUnderwritingAmount = this.applicant.AddUwAmt as number;
        this.maxAdditionalUWAmount = maxUnderwritingAmount - (underwritingAmount - additionalUnderwritingAmount);
    }

    private showValidationMsgDialog(): Promise<DialogResult> {
        return this._confirmDialog.open({
            message: this.i18n({
                value: 'Birth date cannot be greater than Application Received Date or Agent Signed Date.',
                id: 'policy.applicantinfo.dialog.datevalidation.message'
            }),
            title: this.i18n({ value: 'Validation message', id: 'policy.applicantinfo.dialog.datevalidation.title' }),
            buttons: [new DialogButton({ type: DialogButtonType.OK })]
        });
    }

    private resetOriginalBirthDate(): void {
        this.applicant.BirthDate = null;
    }

    private setupApplicantData(): void {
        this.setupAddresses();
        this.setupPhones();
    }

    public onApplicantNameChanged(): void {
        this.setUpdatedApplicantName();
        this.publishNameChanges();
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
        if (this._messagingService.channelExist(ApplicantChannel.ApplicantNameChange)) {
            this._messagingService.closeChannel(ApplicantChannel.ApplicantNameChange);
        }
    }

    private setupPhones(): void {
        this.homePhone = PhoneUtil.getPhone(this.applicant.Phones_LazyLoad, PhoneTypes.HOME);
        this.workPhone = PhoneUtil.getPhone(this.applicant.Phones_LazyLoad, PhoneTypes.WORK);
        this.cellPhone = PhoneUtil.getPhone(this.applicant.Phones_LazyLoad, PhoneTypes.CELL);
    }

    private setUpdatedApplicantName(): void {
        this._updatedApplicantName = NameUtil.getFullNameWithMiddleInitial({
            firstName: this.applicant.FirstName,
            middleName: this.applicant.MiddleName,
            lastName: this.applicant.LastName
        });
    }

    private setApplicant(): void {
        this.applicant = this._applicantListHelper.getActiveApplicantOrDefault(this._policy.Insureds_LazyLoad);
    }

    private setPanelHeader(): void {
        const applicantStatus = MetadataUtil.getItemByExternalCode(
            this.listData.applicant_status,
            this.applicant.ApplicantStatus
        );
        this.applicantPanelHeader = this._applicantInfoHeaderBuilder.getApplicantInfoHeader(
            this.applicant,
            applicantStatus
        );
    }

    private setupAddresses(): void {
        this.residenceAddress = AddressUtil.getAddress(this.applicant.Addresses_LazyLoad, AddressTypes.RESIDENCE);
    }

    private setApplicationsData(): void {
        this.applications = this.applicant.Applications_LazyLoad;
    }

    private setBirthDateLimit(): Date {
        const today = new Date().getDate();
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        return new Date(currentYear, currentMonth, today - 1);
    }

    private publishNameChanges(): void {
        this._messagingService.publish(ApplicantChannel.ApplicantNameChange, this._updatedApplicantName);
    }

    private applicantBirthDateExists(): boolean {
        return DBDateUtil.isDateSet(this.applicant.BirthDate);
    }

    private setHippaAuthorizationFlag(): void {
        this.applicant.Applications_LazyLoad[0].HippaAuthorizationFlag =
            this.applicant.Applications_LazyLoad[0].HippaAuthorizationFlag != 0
                ? hippaAuthorizationFlag.yes
                : hippaAuthorizationFlag.no;
    }
}
