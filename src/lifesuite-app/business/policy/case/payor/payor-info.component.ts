import { Component, Injector, Injectable, Type } from '@angular/core';

import { IComponentResolver, ComponentResolver, ComponentMap } from 'life-core/util';
import { ItemListAnimations } from 'life-core/component/item-list';

import {
    PayorPersonComponent,
    PayorCompanyComponent,
    PayorEstateComponent,
    PayorPartnershipComponent,
    PayorTrustComponent
} from './type';
import { PolicyDTO, AddressTypes, InsuredDTO, PartyTypes, PayorSubRoleTypes } from 'ls-core/model';
import { PolicySubscriber } from 'ls-core/session';
import { PrimaryInsuredHelper } from 'business/policy/shared';
import { AddressUtil } from 'ls-core/util';
import { OptionalSectionDetailViewModel } from 'life-core/component/optional-section';

@Component({
    selector: 'payor-info',
    templateUrl: './payor-info.component.html',
    animations: ItemListAnimations,
    providers: [PolicySubscriber]
})
@Injectable()
export class PayorInfoComponent extends OptionalSectionDetailViewModel {
    public itemComponentType: Type<any>;

    private _componentMapResolver: IComponentResolver<string>;
    private _policy: PolicyDTO;
    constructor(injector: Injector, policySubscriber: PolicySubscriber) {
        super(injector);
        policySubscriber.subscribe(this, p => {
            this._policy = p;
        });
        this._componentMapResolver = this.getComponentMapResolver();
    }

    public setupData(): void {
        this.initAddress();
        this.setResolvedListData();
        this.setInitialComponentType();
    }

    public onPrimaryInsuredAsPayorClick(event: any): void {
        if (event) {
            this.setPayorAsPrimaryInsured();
        } else {
            this.removePrimaryInsuredAsPayor();
        }
    }

    public onPayorTypeChange(type: any): void {
        PrimaryInsuredHelper.resetOwnerPayorDataUponOwnerPayorTypeChange(this.data);
        this.initAddress();
        this.setItemComponentType(type.value);
    }

    private setInitialComponentType(): void {
        if (this.data.PersonTypeId) {
            this.setItemComponentType(this.data.PersonTypeId);
        } else {
            this.setItemComponentType(PartyTypes.PERSON);
        }
    }

    private setPayorAsPrimaryInsured(): void {
        this.copyDataFromPrimaryInsured();
        this.setItemComponentType(PartyTypes.PERSON);
    }

    private copyDataFromPrimaryInsured(): void {
        const primaryInsured: InsuredDTO = PrimaryInsuredHelper.getPrimaryInsured(this._policy);
        if (primaryInsured) {
            this.changeManager.markObjectAsDeletedByIdentifier(this.data.identifier);
            PrimaryInsuredHelper.copyDataFromPrimaryInsuredToNewData(primaryInsured, this.data);
            this.data.SubRoleId = PayorSubRoleTypes.PRIMARY;
        }
    }

    private setItemComponentType(type: string): void {
        this.itemComponentType = this._componentMapResolver.resolve(type);
    }

    private removePrimaryInsuredAsPayor(): void {
        this.changeManager.markObjectAsDeletedByIdentifier(this.data.identifier);
        PrimaryInsuredHelper.removePrimaryInsuredDataFromItem(this.data);
    }

    private initAddress(): void {
        AddressUtil.addAddressIfNotFound(this.data.Addresses_LazyLoad, AddressTypes.RESIDENCE);
    }

    private getComponentMapResolver(): IComponentResolver<string> {
        const componentMap: ComponentMap = new ComponentMap();
        componentMap.add(PartyTypes.COMPANY, PayorCompanyComponent);
        componentMap.add(PartyTypes.ESTATE, PayorEstateComponent);
        componentMap.add(PartyTypes.PARTNERSHIP, PayorPartnershipComponent);
        componentMap.add(PartyTypes.PERSON, PayorPersonComponent);
        componentMap.add(PartyTypes.TRUST, PayorTrustComponent);
        return new ComponentResolver<string>(componentMap);
    }
}
