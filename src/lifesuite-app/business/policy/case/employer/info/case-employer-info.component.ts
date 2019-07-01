import { Component, Injector } from '@angular/core';

import { OptionalSectionDetailViewModel } from 'life-core/component/optional-section';

import { AppSession } from 'ls-core/session/app-session';
import { AddressDTO, PhoneDTO, AddressTypes, PhoneTypes, PolicyDTO } from 'ls-core/model';
import { ListDataUtil, SavePolicyDataDelegate } from 'ls-core/service';
import { AddressUtil, PhoneUtil } from 'ls-core/util';

import { EmployerDataResolver } from '../case-employer-data.resolver';

@Component({
    selector: 'case-employer-info',
    templateUrl: './case-employer-info.component.html'
})
export class EmployerInfoComponent extends OptionalSectionDetailViewModel {
    public businessAddress: AddressDTO;
    public workPhone: PhoneDTO;
    public faxPhone: PhoneDTO;
    public employerDataExist: boolean;
    public countryName: string;
    public stateName: string;
    private _appSession: AppSession;
    private _employerResolver: EmployerDataResolver;

    constructor(injector: Injector, employerDataResolver: EmployerDataResolver, appSession: AppSession) {
        super(injector);
        this._appSession = appSession;
        this._employerResolver = employerDataResolver;
        this.businessAddress = new AddressDTO();
    }

    public onCompanyCodeNameChange(selectedCompanyCode: any): void {
        if (selectedCompanyCode.value) {
            if (this.listData.Employer_CompanyCode) {
                const employerId = ListDataUtil.getExternalCodeFromListDataById(
                    this.listData.Employer_CompanyCode,
                    selectedCompanyCode.value
                );
                // since employer id does not exist, updating appSession with Employer Id
                this._appSession.policyDTO.EmployerId = employerId;
                this.resolveEmployerData();
            }
        } else {
            this.data.PersonId = null;
            this._appSession.policyDTO.EmployerId = null;
            this.employerDataExist = this.employerDataExists();
        }
    }

    protected setupData(): void {
        this.setResolvedMetaData();
        this.setResolvedListData();
        this.employerDataExist = this.employerDataExists();
        if (this.employerDataExist) {
            this.setLazyLoadProperties();
        }
    }

    protected getDataToSave(): PolicyDTO {
        return this.data.policy;
    }

    protected getSaveDataDelegate(): SavePolicyDataDelegate {
        return this.injector.get(SavePolicyDataDelegate);
    }

    private employerDataExists(): boolean {
        return !!this.data.PersonId;
    }

    private resolveEmployerData(): void {
        this._employerResolver.directResolve().then(result => {
            this.data = result;
            this.setLazyLoadProperties();
            this.employerDataExist = this.employerDataExists();
        });
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

        this.workPhone = PhoneUtil.getPhone(this.data.Phones_LazyLoad, PhoneTypes.WORK);
        if (!this.workPhone) {
            this.workPhone = PhoneUtil.getPhone(this.data.Phones_LazyLoad, PhoneTypes.BUSINESS);
            if (!this.workPhone) {
                this.workPhone = PhoneUtil.getPhone(this.data.Phones_LazyLoad, PhoneTypes.HOME);
            }
        }

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
}
