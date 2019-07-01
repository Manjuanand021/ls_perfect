import { Component, Injector } from '@angular/core';

import { SecondaryTabHostViewModel } from 'life-core/component/layout/tabview';
import { DialogButton, DialogButtonType, ModalDialog, DialogSize } from 'life-core/component/dialog';
import { ListItem } from 'life-core/model';
import { ResolvedDataNames, ValidationRenderType } from 'life-core/view-model';
import { MessagingService, IMessagingService } from 'life-core/messaging';
import { I18n } from 'life-core/i18n';
import { NameFormatter } from 'life-core/util/formatter/name.formatter';
import { NamePattern } from 'life-core/util/formatter/name-pattern';

import { PolicySubscriber } from 'ls-core/session';
import {
    PolicyDTO,
    AddressDTO,
    InsuredDTO,
    PhoneDTO,
    MedicalProviderProxyDTO,
    PartyRelationDTO,
    AddressTypes,
    PhoneTypes,
    RequirementDTO,
    CountryFilterList
} from 'ls-core/model';
import { AddressUtil, PhoneUtil } from 'ls-core/util';

import { RequirementDetailContext, RequirementDetailContextModel } from './requirement-detail-context';
import { MedicalProviderSearchComponent, MedicalSearchMetaDataResolver } from './medical-provider-search';
import { RequirementsTabChannels } from './requirements-tab.channels';
import { RequirementStatuses, PersonIdToPolicyPersonIdMapper } from 'business/policy/shared';
import { RequirementListDataResolver } from '../requirement-list-data.resolver';

@Component({
    selector: 'requirement-detail-providers-info',
    templateUrl: './requirement-detail-providers-info.component.html',
    styles: [
        `
            .pt-24 {
                padding-top: 24px;
            }
        `
    ],
    providers: [PolicySubscriber]
})
export class RequirementDetailProvidersInfo extends SecondaryTabHostViewModel<RequirementDTO> {
    public physicianList: Array<ListItem>;

    public selectedPhysician: string;

    public partyRelation: PartyRelationDTO;

    public medicalProvider: MedicalProviderProxyDTO;

    public providerDetails: any;

    public hospitalName: string;

    public patientId: string;

    public isHospitalFieldRequired: boolean;

    public isRequirementSatisfied: boolean;

    private _messagingService: IMessagingService;

    private _modalDialog: ModalDialog;

    private _policy: PolicyDTO;

    private _currentInsured: InsuredDTO;

    private _nameFormatter: NameFormatter;

    constructor(
        injector: Injector,
        policySubscriber: PolicySubscriber,
        messagingService: MessagingService,
        requirementDetailContext: RequirementDetailContext,
        modalDialog: ModalDialog,
        nameFormatter: NameFormatter,
        i18n: I18n
    ) {
        super(injector);
        policySubscriber.subscribe(this, p => {
            this._policy = p;
        });
        this.i18n = i18n;
        this._messagingService = messagingService;
        this.medicalProvider = new MedicalProviderProxyDTO();
        this.partyRelation = new PartyRelationDTO();
        this._modalDialog = modalDialog;
        this._nameFormatter = nameFormatter;
        this.subscriptionTracker.track(
            requirementDetailContext.contextObservable.subscribe(context => {
                this.setContext(context);
            })
        );
        this.updateHospitalFieldRequired();
    }

    public onPhysicianChange(selectedPhysician: any): void {
        if (selectedPhysician && selectedPhysician.value) {
            this.partyRelation = this._currentInsured.Relations_LazyLoad.find(
                relation => relation.PersonId.toString() === selectedPhysician.value
            );
            this.setMedicalProviderData();
            this.updateHospitalFieldRequired();
        } else {
            this.setInitialMedicalProviderProxyDTO();
            this.updateHospitalFieldRequired();
        }
    }

    public onCountryChange(): void {
        this.resetZipCode();
    }

    public updateHospitalFieldRequired(): void {
        this.isHospitalFieldRequired = this.data.medicalProviderProxyDTO.Company ? true : false;
    }

    public updateNameFieldsRequired(): void {
        this.isHospitalFieldRequired =
            this.data.medicalProviderProxyDTO.FirstName || this.data.medicalProviderProxyDTO.LastName ? false : true;
    }

    public onProviderSearchButtonClick(): void {
        this.openProviderSearchDialog();
    }

    public ngAfterViewInit(): void {
        super.ngAfterViewInit();
        this.registerTabChangeHandler();
    }

    public registerTabChangeHandler(): void {
        this._messagingService.subscribeExclusively(RequirementsTabChannels.ValidateProviderInfo, showError =>
            this.triggerViewValidation(showError)
        );
    }

    public loadData(): Promise<void> {
        this.setResolvedMetaData();
        return Promise.resolve();
    }

    protected setupData(): void {
        this.getFilteredCountryList();
        this.setPhysicianListSelection();
    }

    protected loadPhysicianList(): void {
        this._currentInsured = PersonIdToPolicyPersonIdMapper.getInsuredByPolicyPersonId(
            this.data.PolicyPersonId.toString(),
            this._policy.Insureds_LazyLoad
        );
        const relation: Array<any> = this._currentInsured.Relations_LazyLoad;
        let physicianName: string;
        this.physicianList = [];
        relation.forEach(physician => {
            physicianName = this._nameFormatter.format(
                NamePattern.LastAndFirstName,
                physician.FirstName,
                physician.LastName
            );

            this.physicianList.push(
                new ListItem(physicianName, physician.PersonId ? physician.PersonId.toString() : '')
            );
        });
    }

    private resetZipCode(): void {
        this.data.medicalProviderProxyDTO.Zip = '';
    }

    private getAddressDetails(): AddressDTO {
        AddressUtil.addAddressIfNotFound(this.partyRelation.Addresses_LazyLoad, AddressTypes.BUSINESS);
        return AddressUtil.getAddress(this.partyRelation.Addresses_LazyLoad, AddressTypes.BUSINESS);
    }

    private getPhoneDetails(): PhoneDTO {
        PhoneUtil.addPhoneIfNotFound(this.partyRelation.Phones_LazyLoad, PhoneTypes.BUSINESS);
        return PhoneUtil.getPhone(this.partyRelation.Phones_LazyLoad, PhoneTypes.BUSINESS);
    }

    private setMedicalProviderData(): void {
        const businessAddress = this.getAddressDetails();
        const workPhone = this.getPhoneDetails();

        // this.data.medicalProviderProxyDTO = new MedicalProviderProxyDTO();
        this.data.medicalProviderProxyDTO.FirstName = this.partyRelation.FirstName;
        this.data.medicalProviderProxyDTO.LastName = this.partyRelation.LastName;
        this.data.medicalProviderProxyDTO.PhysicianID = this.partyRelation.PersonId.toString();
        this.data.medicalProviderProxyDTO.ClientID = this.partyRelation.ClientId;
        this.data.medicalProviderProxyDTO.AddressLine1 = businessAddress.AddressLine1;
        this.data.medicalProviderProxyDTO.AddressLine2 = businessAddress.AddressLine2;
        this.data.medicalProviderProxyDTO.AddressCity = businessAddress.City;
        this.data.medicalProviderProxyDTO.AddressState = this.getAddressStateCode(businessAddress.CountryStateId);
        this.data.medicalProviderProxyDTO.Zip = businessAddress.PostalCode;
        this.data.medicalProviderProxyDTO.CountryID = businessAddress.CountryId;
        this.data.medicalProviderProxyDTO.PhoneDTO = workPhone;
    }

    private setContext(context: RequirementDetailContextModel): void {
        if (context) {
            this.data = context.requirement;
            this.loadPhysicianList();
            if (!this.data.medicalProviderProxyDTO) {
                this.setInitialMedicalProviderProxyDTO();
                this.updateHospitalFieldRequired();
            } else if (this.data.medicalProviderProxyDTO.FirstName || this.data.medicalProviderProxyDTO.Company) {
                this.data.medicalProviderProxyDTO.AddressState = this.getAddressStateCode(
                    this.data.medicalProviderProxyDTO.AddressState
                );
                this.setPhysicianListSelection();
                this.updateHospitalFieldRequired();
            }
            this.setIsRequirementSatisfied();
        }
    }

    private getAddressStateCode(addressState: string): string {
        return addressState
            ? addressState.slice(0, 3) === 'USA' || addressState.slice(0, 3) === 'CAN'
                ? addressState.slice(3)
                : addressState
            : null;
    }

    private setInitialMedicalProviderProxyDTO(): void {
        this.data.medicalProviderProxyDTO = new MedicalProviderProxyDTO();
        this.data.medicalProviderProxyDTO.PhoneDTO = new PhoneDTO();
    }

    private getFilteredCountryList(): void {
        this.listData.country = this.listData.country.filter(country => CountryFilterList.indexOf(country.value) != -1);
    }

    private openProviderSearchDialog(): void {
        this._modalDialog
            .open({
                view: MedicalProviderSearchComponent,
                resolve: [
                    { resolveName: ResolvedDataNames.metaData, resolverClass: MedicalSearchMetaDataResolver },
                    { resolveName: ResolvedDataNames.listData, resolverClass: RequirementListDataResolver }
                ],
                title: this.i18n({ value: 'Medical Provider Search', id: 'policy.requirement.providersearch' }),
                buttons: [
                    new DialogButton({ type: DialogButtonType.SELECT }),
                    new DialogButton({ type: DialogButtonType.CANCEL, options: { isDefault: true } })
                ],
                size: DialogSize.large
            })
            .then(dialogRef => {
                dialogRef.result.then(result => {
                    if (result.returnValue) {
                        this.setSelectedMedicalProvider(result.returnValue.selectedMedicalProvider);
                    }
                });
            });
    }

    private setSelectedMedicalProvider(provider: MedicalProviderProxyDTO): void {
        this.data.medicalProviderProxyDTO = provider;
        this.data.medicalProviderProxyDTO.AddressState = this.getAddressStateCode(provider.AddressState);
        this.setPhysicianListSelection();
    }

    private setPhysicianListSelection(): void {
        if (this.data.medicalProviderProxyDTO) {
            const selectedPhysician = this.physicianList.find(
                physician => physician.value == this.data.medicalProviderProxyDTO.PhysicianID
            );
            this.selectedPhysician = selectedPhysician ? selectedPhysician.value : '';
        }
    }

    private triggerViewValidation(showError: boolean): void {
        // without delay/setTimeout validation wont kick in
        setTimeout(() => {
            this.validate(showError ? ValidationRenderType.ifNeeded : ValidationRenderType.never);
        });
    }

    private setIsRequirementSatisfied(): void {
        this.isRequirementSatisfied =
            this.data.ClosedDisposition && this.data.ClosedDisposition.toUpperCase() === RequirementStatuses.SATISFIED;
    }
}
