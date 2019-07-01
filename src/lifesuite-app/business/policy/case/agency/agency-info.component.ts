import { Component, Injector, Injectable } from '@angular/core';

import { OptionalSectionDetailViewModel } from 'life-core/component/optional-section';

import { AppSession } from 'ls-core/session/app-session';
import { AgencyDTO, AddressDTO, PhoneDTO, AddressTypes, MetadataItem, PhoneTypes } from 'ls-core/model';
import { AddressUtil } from 'ls-core/util/collection/address.util';
import { PhoneUtil } from 'ls-core/util/collection/phone.util';

import { AgencyDataResolver } from './agency-data.resolver';

@Component({
    selector: 'agency-info',
    templateUrl: './agency-info.component.html'
})
@Injectable()
export class AgencyInfoComponent extends OptionalSectionDetailViewModel {
    public businessAddress: AddressDTO;
    public workPhone: PhoneDTO;
    public faxPhone: PhoneDTO;
    public countryName: string;
    public stateName: string;
    public agencyDataExist: boolean;
    private _appSession: AppSession;
    private _agencyResolver: AgencyDataResolver;

    constructor(injector: Injector, agencyDataResolver: AgencyDataResolver, appSession: AppSession) {
        super(injector);
        this._appSession = appSession;
        this._agencyResolver = agencyDataResolver;
    }

    protected get agency(): AgencyDTO {
        return this.data;
    }

    protected setupData(): void {
        this.setResolvedMetaData();
        this.setResolvedListData();
        this.setAgencyDataExist();
        this.setAddressDetails();
        this.setPhoneDetails();
        this.setFaxDetails();
    }

    private setAgencyDataExist(): void {
        this.agencyDataExist = this.agencyDataExists();
    }

    private agencyDataExists(): boolean {
        return !!this.data.PersonId;
    }

    public onAgencyChange(selectedAgency: any): void {
        this.removeExistingAgency();
        if (this.isAgencySelected(selectedAgency)) {
            this.resolveAgencyData(selectedAgency);
        } else {
            this.resetAgencyData();
        }
    }

    private removeExistingAgency(): void {
        this.updateDeletedObjectsArray(this.getItem());
        this.executeRemoveItem();
        // This is required because without this the old record is not getting deleted from DB
        this.changeManager.setIsDirty(true);
    }

    private getItem(): any {
        return this._appSession.policyDTO.Agencies_LazyLoad[0];
    }

    private executeRemoveItem(): void {
        this._appSession.policyDTO.Agencies_LazyLoad = [];
    }

    private updateDeletedObjectsArray(itemData: any): void {
        if (this.changeManager != null && itemData) {
            this.changeManager.deleteObject(itemData);
        }
    }

    private isAgencySelected(selectedAgency: any): boolean {
        return selectedAgency && selectedAgency.value;
    }

    private resetAgencyData(): void {
        this.data.PersonId = null;
        this.agencyDataExist = this.agencyDataExists();
        this.businessAddress = new AddressDTO();
        this.workPhone = new PhoneDTO();
        this.faxPhone = new PhoneDTO();
    }

    private resolveAgencyData(selectedAgency: any): void {
        this._agencyResolver.agencyPersonId = selectedAgency.value;
        this._agencyResolver.directResolve().then(result => {
            this.setAgencyData(result);
            this.setAddressDetails();
            this.setPhoneDetails();
            this.setAgencyDataExist();
            this.setFaxDetails();
            this.updatePolicy();
        });
    }

    private setAgencyData(result: any): void {
        if (result.PersonId) {
            this.data = result;
        } else {
            this.logger.log('Data issue. We must get PersonId back from DB when we are trying to get Agency details.');
        }
    }

    private updatePolicy(): void {
        // We are creating a new object as MT works only when you pass a personId and not other data.
        // If you send all the data to MT while saving, it does not recognise the change and ultimately does not save data.
        const agencyDTO = new AgencyDTO();
        agencyDTO.PersonId = this.data.PersonId;
        this._appSession.policyDTO.Agencies_LazyLoad.push(agencyDTO);
    }

    private setAddressDetails(): void {
        this.businessAddress = this.getBusinessAddress();
        this.countryName = this.getCountryLabel();
        this.stateName = this.getStateLabel();
    }

    private getBusinessAddress(): AddressDTO {
        return this.data.Addresses_LazyLoad != null && this.data.Addresses_LazyLoad.length > 0
            ? AddressUtil.getAddress(this.data.Addresses_LazyLoad, AddressTypes.BUSINESS)
            : new AddressDTO();
    }

    private setPhoneDetails(): void {
        if (this.data.Phones_LazyLoad != null && this.data.Phones_LazyLoad.length > 0) {
            this.workPhone = PhoneUtil.getPhone(this.data.Phones_LazyLoad, this.getPhoneTypeHavingData());
        }
    }

    private getPhoneTypeHavingData(): string {
        const phoneType = this.data.Phones_LazyLoad.find(phone => phone.PhoneTypeCode && phone.PhoneTypeCode != 'FAX');
        return phoneType.PhoneTypeCode;
    }

    private setFaxDetails(): void {
        this.faxPhone = PhoneUtil.getPhone(this.data.Phones_LazyLoad, PhoneTypes.FAX);
    }
    private getCountryLabel(): string {
        if (this.businessAddress.CountryId) {
            const country = this.listData.CountryId.find(address => address.Id === this.businessAddress.CountryId);
            return country ? country.value : '';
        }
    }

    private getStateLabel(): string {
        if (this.businessAddress.CountryStateId) {
            return this.businessAddress.CountryId === 'USA'
                ? this.getStateName(this.listData.country_state_usa)
                : this.getStateName(this.listData.country_state_canada);
        }
    }

    private getStateName(stateList: MetadataItem[]): string {
        const state = stateList.find(address => address.value === this.businessAddress.CountryStateId);
        return state ? state.label : '';
    }
}
