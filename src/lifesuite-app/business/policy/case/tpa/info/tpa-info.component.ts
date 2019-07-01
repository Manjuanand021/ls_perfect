import { Component, Injector } from '@angular/core';

import { OptionalSectionDetailViewModel } from 'life-core/component/optional-section';

import { AppSession } from 'ls-core/session/app-session';
import { AddressDTO, PhoneDTO, AddressTypes, PhoneTypes, PolicyDTO } from 'ls-core/model';
import { SavePolicyDataDelegate } from 'ls-core/service';
import { AddressUtil, PhoneUtil } from 'ls-core/util';
import { NameUtil } from 'life-core/util';

import { TPADataResolver } from '../tpa-data.resolver';

@Component({
    selector: 'tpa-info',
    templateUrl: './tpa-info.component.html'
})
export class TPAInfoComponent extends OptionalSectionDetailViewModel {
    public businessAddress: AddressDTO;
    public workPhone: PhoneDTO;
    public faxPhone: PhoneDTO;
    public countryName: string;
    public stateName: string;
    public tpaDataExists: boolean;
    public fullName: string;
    private _appSession: AppSession;
    private _tpaResolver: TPADataResolver;

    constructor(injector: Injector, tpaDataResolver: TPADataResolver, appSession: AppSession) {
        super(injector);
        this._appSession = appSession;
        this._tpaResolver = tpaDataResolver;
        this.businessAddress = new AddressDTO();
    }

    public onTpaNameChange(selectedTpa: any): void {
        if (selectedTpa && selectedTpa.value) {
            this.setTpaCodeValue(selectedTpa.value);
            this.resolveTPAData();
        } else {
            this.resetTpaCodeValue();
            this.setTpaDataFlag();
            this.resetTpaCodeInAppsession();
        }
    }

    protected setupData(): void {
        this.setResolvedListData();
        this.setTpaDataFlag();
        if (this.tpaDataExists) {
            this.setLazyLoadProperties();
            this.formatContactName();
        }
    }

    protected getDataToSave(): PolicyDTO {
        return this.data.policy;
    }

    protected getSaveDataDelegate(): SavePolicyDataDelegate {
        return this.injector.get(SavePolicyDataDelegate);
    }

    private tpaDataExist(): boolean {
        return !!this.data.TpaCode;
    }

    private setTpaDataFlag(): void {
        this.tpaDataExists = this.tpaDataExist();
    }

    private resetTpaCodeValue(): void {
        this.data.TpaCode = null;
    }

    private resetTpaCodeInAppsession(): void {
        this._appSession.policyDTO.TpaCode = null;
    }

    private setTpaCodeValue(selectedTpaCode: string): void {
        this._appSession.policyDTO.TpaCode = selectedTpaCode;
    }

    private resolveTPAData(): void {
        this._tpaResolver.directResolve().then(result => {
            this.setTpaData(result);
            this.setLazyLoadProperties();
            this.setTpaDataFlag();
            this.formatContactName();
        });
    }

    private setTpaData(result: any): void {
        this.data = result;
    }

    private setLazyLoadProperties(): void {
        this.initializeAddressAndPhoneLazyLoadsIfEmpty();
        this.setAddressAndPhoneData();
        this.setCountryAndState();
    }

    private initializeAddressAndPhoneLazyLoadsIfEmpty(): void {
        if (!this.data.Addresses_LazyLoad) {
            this.data.Addresses_LazyLoad = new Array<AddressDTO>();
        }
        if (!this.data.Phones_LazyLoad) {
            this.data.Phones_LazyLoad = new Array<PhoneDTO>();
        }
    }

    private setAddressAndPhoneData(): void {
        AddressUtil.addAddressIfNotFound(this.data.Addresses_LazyLoad, AddressTypes.BUSINESS);
        this.businessAddress = AddressUtil.getAddress(this.data.Addresses_LazyLoad, AddressTypes.BUSINESS);
        PhoneUtil.addPhoneIfNotFound(this.data.Phones_LazyLoad, PhoneTypes.WORK);
        this.workPhone = PhoneUtil.getPhone(this.data.Phones_LazyLoad, PhoneTypes.WORK);
        PhoneUtil.addPhoneIfNotFound(this.data.Phones_LazyLoad, PhoneTypes.FAX);
        this.faxPhone = PhoneUtil.getPhone(this.data.Phones_LazyLoad, PhoneTypes.FAX);
    }

    private setCountryAndState(): void {
        if (this.businessAddress.CountryId) {
            this.countryName = this.listData.CountryId.find(
                address => address.Id === this.businessAddress.CountryId
            ).value;
        }
        if (this.businessAddress.CountryStateId) {
            this.stateName = this.listData.CountryStateId.find(
                address => address.Id === this.businessAddress.CountryStateId
            ).value;
        }
    }

    private formatContactName(): void {
        const firstName = this.data.ContactFirstName;
        const lastName = this.data.ContactLastName;
        this.fullName = NameUtil.getFullName({ firstName, lastName });
    }
}
