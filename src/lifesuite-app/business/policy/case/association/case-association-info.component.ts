import { Component, Injector, Injectable } from '@angular/core';

import { OptionalSectionDetailViewModel } from 'life-core/component/optional-section';
import { ListItem } from 'life-core/model/list.model';

import { AppSession } from 'ls-core/session/app-session';
import { AssociationDTO, AddressDTO, PhoneDTO, AddressTypes, PhoneTypes } from 'ls-core/model';
import { MetadataUtil } from 'ls-core/util/metadata/metadata.util';
import { ListDataUtil } from 'ls-core/service/list-data/list-data.util';
import { AddressUtil } from 'ls-core/util/collection/address.util';
import { PhoneUtil } from 'ls-core/util/collection/phone.util';

import { AssociationDataResolver } from './case-association-data.resolver';

@Component({
    selector: 'case-association-info',
    templateUrl: './case-association-info.component.html'
})
@Injectable()
export class AssociationInfoComponent extends OptionalSectionDetailViewModel {
    public businessAddress: AddressDTO;
    public workPhone: PhoneDTO;
    public faxPhone: PhoneDTO;
    public associationDataExist: boolean;
    public countryName: string;
    public stateName: string;
    private _appSession: AppSession;
    private _associationResolver: AssociationDataResolver;

    constructor(injector: Injector, AssociationDataResolver: AssociationDataResolver, appSession: AppSession) {
        super(injector);
        this._appSession = appSession;
        this._associationResolver = AssociationDataResolver;
        this.businessAddress = new AddressDTO();
    }

    protected get association(): AssociationDTO {
        return this.data;
    }

    protected setupData(): void {
        this.setResolvedListData();
        this.associationDataExist = this.associationDataExists();
        if (this.associationDataExist) {
            this.setLazyLoadProperties();
            this.setAssociationData();
        }
    }

    private associationDataExists(): boolean {
        return !!this.data.CompanyCode;
    }

    public onCompanyCodeNameChange(selectedCompanyCode: any): void {
        if (selectedCompanyCode.value) {
            this._appSession.policyDTO.AssociationCode = selectedCompanyCode.value;
            this.resolveAssociationData();
        } else {
            this.association.CompanyCode = '';
            this.associationDataExist = this.associationDataExists();
            this._appSession.policyDTO.AssociationCode = null;
        }
    }

    private resolveAssociationData(): void {
        this._associationResolver.directResolve().then(result => {
            this.data = result;
            this.setLazyLoadProperties();
            this.setAssociationData();
            this.associationDataExist = this.associationDataExists();
        });
    }

    private setLazyLoadProperties(): void {
        if (this.association.Addresses_LazyLoad.length > 0) {
            this.businessAddress = AddressUtil.getAddress(this.association.Addresses_LazyLoad, AddressTypes.BUSINESS);
        }
        if (this.association.Phones_LazyLoad.length > 0) {
            this.workPhone = PhoneUtil.getPhone(this.association.Phones_LazyLoad, PhoneTypes.WORK);
            if (!this.workPhone) {
                this.workPhone = PhoneUtil.getPhone(this.association.Phones_LazyLoad, PhoneTypes.BUSINESS);
                if (!this.workPhone) {
                    this.workPhone = PhoneUtil.getPhone(this.association.Phones_LazyLoad, PhoneTypes.HOME);
                }
            }
            this.faxPhone = PhoneUtil.getPhone(this.association.Phones_LazyLoad, PhoneTypes.FAX);
        }
    }

    private setAssociationData(): void {
        this.setCountryLabel();
        this.setCountryStateLabel();
        this.setAssocExpirationDate();
    }

    private setCountryLabel(): void {
        const countryList: Array<ListItem> = ListDataUtil.convertToListItemArray(this.listData.CountryId);
        this.countryName = MetadataUtil.getItemLabelByCode(countryList, this.businessAddress.CountryId);
    }

    private setCountryStateLabel(): void {
        const stateList: Array<ListItem> = ListDataUtil.convertToListItemArray(this.listData.CountryStateId);
        this.stateName = MetadataUtil.getItemLabelByCode(stateList, this.businessAddress.CountryStateId);
    }

    private setAssocExpirationDate(): void {
        this.data.assocExpirationDate = this.data.ExpirationDate;
    }
}
