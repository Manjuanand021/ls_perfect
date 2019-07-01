import { Component, Injector, Injectable } from '@angular/core';

import { BasePolicyDialogDetailViewModel } from 'business/policy/shared/master-detail';
import { ParentChildRegistry, ViewValidationResult } from 'life-core/view-model';
import { I18n } from 'life-core/i18n';
import { ICancelableDataManager, CancelableDataManager } from 'life-core/data-management';
import {
    DialogButtonType,
    DialogButton,
    DialogResult,
    ConfirmDialog,
    DialogViewModelResult,
    DialogData
} from 'life-core/component/dialog';
import { AuthorizationProvider } from 'life-core/authorization';

import { PolicySubscriber } from 'ls-core/session';
import { PartyRelationDTO, AddressDTO, AddressTypes, PhoneTypes, PhoneDTO, InsuredDTO, PolicyDTO } from 'ls-core/model';
import { AddressUtil, PhoneUtil } from 'ls-core/util';

import { ApplicantListHelper } from 'business/policy/shared';
import { ApplicantAuthorizationProvider } from './../../applicant-authorization.provider';

const DEFAULT_PERSON_TYPE = 'PHYSICIAN';

@Component({
    selector: 'physician-information-detail-editor',
    templateUrl: './physician-information-detail-editor.html',
    providers: [
        ParentChildRegistry,
        PolicySubscriber,
        { provide: AuthorizationProvider, useClass: ApplicantAuthorizationProvider },
        CancelableDataManager
    ]
})
@Injectable()
export class PhysicianInformationDialogDetailEditor extends BasePolicyDialogDetailViewModel<PartyRelationDTO> {
    public businessAddress: AddressDTO;
    public businessPhone: PhoneDTO;
    public maxLastVisitDate: Date;
    protected confirmDialog: ConfirmDialog;
    private _applicant: InsuredDTO;
    private _policy: PolicyDTO;
    private _cancelableDataManager: ICancelableDataManager<PartyRelationDTO>;

    constructor(
        injector: Injector,
        policySubscriber: PolicySubscriber,
        applicantHelper: ApplicantListHelper,
        confirmDialog: ConfirmDialog,
        cancelableDataManager: CancelableDataManager,
        i18n: I18n
    ) {
        super(injector);
        this.maxLastVisitDate = new Date();
        policySubscriber.subscribe(this, policy => {
            this._policy = policy;
        });
        this._cancelableDataManager = cancelableDataManager as CancelableDataManager<PartyRelationDTO>;
        this._applicant = applicantHelper.getActiveApplicantOrDefault(this._policy.Insureds_LazyLoad);
        this.confirmDialog = confirmDialog;
        this.i18n = i18n;
    }

    public setModel(model: DialogData): void {
        this.resolvedData = model.resolvedData;
        this._cancelableDataManager.setItem(model.parameterData as PartyRelationDTO);
        this.subscriptionTracker.track(
            this._cancelableDataManager.getItem().subscribe(data => {
                this.data = data;
                this.setBusinessAddress();
                this.setBusinessPhone();
            })
        );
    }

    public setPrimaryPhysician(): void {
        if (this.data.IsPrimaryPhysician && this.hasPrimaryPhysicianAlready()) {
            this.confirmPrimaryPhysicianChange().then(result => {
                if (result.buttonId == DialogButtonType.CANCEL) {
                    this.data.IsPrimaryPhysician = false;
                }
            });
        }
    }

    private hasPrimaryPhysicianAlready(): boolean {
        return this._applicant.Relations_LazyLoad.some(n => n.IsPrimaryPhysician && n.PersonId != this.data.PersonId);
    }

    protected confirmPrimaryPhysicianChange(): Promise<DialogResult> {
        return this.confirmDialog.open({
            title: this.i18n({ value: 'Primary Physician', id: 'policy.applicant.physicianInfo.primaryphysician' }),
            message: this.i18n({
                value:
                    'A Physician is already assigned as Primary. Do you want to continue and designate this Physician as Primary?',
                id: 'policy.applicant.physicianInfo.primaryphysicianalertmsg'
            }),
            buttons: [
                new DialogButton({
                    type: DialogButtonType.OK,
                    options: { isDefault: true }
                }),
                new DialogButton({ type: DialogButtonType.CANCEL })
            ]
        });
    }

    protected beforeDialogClose(buttonId: string): void {
        if (this.isDialogButtonTypeOK(buttonId)) {
            if (this.data.IsPrimaryPhysician) {
                const primary = this._applicant.Relations_LazyLoad.find(
                    n => n.IsPrimaryPhysician && n.PersonId != this.data.PersonId
                );
                if (primary) {
                    primary.IsPrimaryPhysician = false;
                }
            }
            this.savePhysicianDataChanges();
        } else {
            this.cancelPhysicianDataChanges();
        }
    }

    protected setupData(): void {
        this.setResolvedListData();
        this.setResolvedMetaData();
        this.initializePhysicianData();
    }

    private savePhysicianDataChanges(): void {
        this._cancelableDataManager.saveItem(this.data);
    }

    private cancelPhysicianDataChanges(): void {
        this._cancelableDataManager.cancelItem(this.data);
    }

    private initializePhysicianData(): void {
        this.data.IsPrimaryPhysician = this.data.IsPrimaryPhysician || false;
        this.data.Field2 = this.data.Field2 || '0';
        this.data.PersonTypeId = this.data.PersonTypeId || DEFAULT_PERSON_TYPE;
    }

    private setBusinessAddress(): void {
        if (!this.data.Addresses_LazyLoad) {
            this.data.Addresses_LazyLoad = new Array<AddressDTO>();
        }

        AddressUtil.addAddressIfNotFound(this.data.Addresses_LazyLoad, AddressTypes.BUSINESS);
        this.businessAddress = AddressUtil.getAddress(this.data.Addresses_LazyLoad, AddressTypes.BUSINESS);
    }

    private setBusinessPhone(): void {
        if (!this.data.Phones_LazyLoad) {
            this.data.Phones_LazyLoad = new Array<PhoneDTO>();
        }
        PhoneUtil.addPhoneIfNotFound(this.data.Phones_LazyLoad, PhoneTypes.BUSINESS);
        this.businessPhone = PhoneUtil.getPhone(this.data.Phones_LazyLoad, PhoneTypes.BUSINESS);
    }
}
