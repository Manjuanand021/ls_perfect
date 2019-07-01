import { Component, Injector, Injectable, Type } from '@angular/core';

import { ItemViewModel } from 'life-core/component/item-list';
import { IComponentResolver, ComponentResolver, ComponentMap } from 'life-core/util';
import { ItemListAnimations } from 'life-core/component/item-list/animations/animations';

import {
    OwnerPersonComponent,
    OwnerCompanyComponent,
    OwnerEstateComponent,
    OwnerPartnershipComponent,
    OwnerTrustComponent,
    OwnerChangeChannel
} from './type';
import {
    PolicyDTO,
    AddressTypes,
    PhoneTypes,
    InsuredDTO,
    PartyTypes,
    OwnerSubRoleTypes,
    OwnerDTO
} from 'ls-core/model';
import { PolicySubscriber } from 'ls-core/session';
import { PrimaryInsuredHelper } from 'business/policy/shared';
import { AddressUtil, PhoneUtil } from 'ls-core/util';
import { IMessagingService, MessagingService } from 'life-core/messaging';
@Component({
    selector: 'owner-info',
    templateUrl: './owner-info.component.html',
    animations: ItemListAnimations,
    providers: [PolicySubscriber]
})
@Injectable()
export class OwnerInfoComponent extends ItemViewModel<OwnerDTO> {
    public itemComponentType: Type<any>;

    private _componentMapResolver: IComponentResolver<string>;
    private _policy: PolicyDTO;
    private _messagingService: IMessagingService;

    constructor(injector: Injector, policySubscriber: PolicySubscriber, messagingService: MessagingService) {
        super(injector);
        policySubscriber.subscribe(this, p => {
            this._policy = p;
        });
        this._componentMapResolver = this.getComponentMapResolver();
        this._messagingService = messagingService;
    }

    public setupData(): void {
        this.initResidentAddressAndPhone();
        this.setResolvedListData();
        this.setItemComponentType(this.data.PersonTypeId);
        this.setupSubscriptions();
    }
    protected setupSubscriptions(): void {
        this.subscriptionTracker.track(
            this._messagingService.subscribeNewMessageOnly(OwnerChangeChannel.OwnerAsPrimaryInsured, item =>
                this.changeToNonPIWhenOtherOwnerIsSetToPI(item)
            )
        );
    }
    public onPrimaryInsuredAsOwnerClick(value: any): void {
        if (value) {
            this.setOwnerAsPrimaryInsured();
        } else {
            this.removePrimaryInsuredAsOwner();
        }
    }
    /**
     * change this owner from primary insured to non primary insured if another owner is been set as primary insured
     * @param otherSequenceId: other owner's sequence id
     */
    private changeToNonPIWhenOtherOwnerIsSetToPI(otherSequenceId: number): void {
        if (this.data.isPrimaryInsured && otherSequenceId != this.sequenceId) {
            this.removePrimaryInsuredAsOwner();
        }
    }

    public onOwnerTypeChange(type: any): void {
        PrimaryInsuredHelper.resetOwnerPayorDataUponOwnerPayorTypeChange(this.data);
        this.initResidentAddressAndPhone();
        this.setItemComponentType(type.value);
    }

    private setOwnerAsPrimaryInsured(): void {
        this.copyDataFromPrimaryInsured();
        this.setItemComponentType(PartyTypes.PERSON);
        this._messagingService.publish(OwnerChangeChannel.OwnerAsPrimaryInsured, this.sequenceId);
    }

    private initResidentAddressAndPhone(): void {
        AddressUtil.addAddressIfNotFound(this.item.data.Addresses_LazyLoad, AddressTypes.RESIDENCE);
        PhoneUtil.addPhoneIfNotFound(this.item.data.Phones_LazyLoad, PhoneTypes.HOME);
        PhoneUtil.addPhoneIfNotFound(this.item.data.Phones_LazyLoad, PhoneTypes.WORK);
    }

    private getComponentMapResolver(): IComponentResolver<string> {
        const componentMap: ComponentMap = new ComponentMap();
        componentMap.add(PartyTypes.COMPANY, OwnerCompanyComponent);
        componentMap.add(PartyTypes.ESTATE, OwnerEstateComponent);
        componentMap.add(PartyTypes.PARTNERSHIP, OwnerPartnershipComponent);
        componentMap.add(PartyTypes.PERSON, OwnerPersonComponent);
        componentMap.add(PartyTypes.TRUST, OwnerTrustComponent);
        return new ComponentResolver<string>(componentMap);
    }

    private removePrimaryInsuredAsOwner(): void {
        this.changeManager.markObjectAsDeletedByIdentifier(this.data.identifier);
        PrimaryInsuredHelper.removePrimaryInsuredDataFromItem(this.item.data);
        this.resetOwner();
    }

    private setItemComponentType(type: string): void {
        this.itemComponentType = this._componentMapResolver.resolve(type);
    }

    private copyDataFromPrimaryInsured(): void {
        const primaryInsured: InsuredDTO = PrimaryInsuredHelper.getPrimaryInsured(this._policy);
        if (primaryInsured) {
            this.changeManager.markObjectAsDeletedByIdentifier(this.data.identifier);
            PrimaryInsuredHelper.copyDataFromPrimaryInsuredToNewData(primaryInsured, this.data);
            this.data.SubRoleId = OwnerSubRoleTypes.PRIMARY;
            this.item.data = this.data;
            this.resetOwner();
        }
    }

    private resetOwner(): void {
        this.item = { ...this.item };
    }
}
