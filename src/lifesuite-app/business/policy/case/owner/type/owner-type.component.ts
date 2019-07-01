import { Injector, Injectable } from '@angular/core';

import { ViewModel } from 'life-core/view-model';
import { ICompose } from 'life-core/component/compose';
import { IItem } from 'life-core/component/item-list';
import { ListDataUpdater } from 'ls-core/service';
import { AddressDTO, AddressTypes, PhoneDTO, PhoneTypes, OwnerDTO } from 'ls-core/model';
import { AddressUtil, PhoneUtil } from 'ls-core/util';
import { IMessagingService, MessagingService } from 'life-core/messaging';

@Injectable()
export class OwnerTypeComponent extends ViewModel<OwnerDTO> implements ICompose {
    public item: IItem<OwnerDTO>;
    public residentAddress: AddressDTO;
    public workPhone: PhoneDTO;
    public homePhone: PhoneDTO;
    private _messagingService: IMessagingService;

    protected listDataUpdater: ListDataUpdater;

    constructor(injector: Injector) {
        super(injector);
        this.listDataUpdater = injector.get(ListDataUpdater);
        this._messagingService = injector.get(MessagingService);
    }

    public setupData(): void {
        this.setupSubscriptions();
    }

    protected setupSubscriptions(): void {
        this.subscriptionTracker.track(
            this._messagingService.subscribeNewMessageOnly(OwnerChangeChannel.OwnerAsPrimaryOwner, item =>
                this.changeToNonPrimaryOwnerWhenOtherOwnerIsSetToPrimaryOwner(item)
            )
        );
    }

    public setModel(model: any): void {
        this.item = model;
        this.data = this.item.data;
        this.initAddress();
    }

    private initAddress(): void {
        this.residentAddress = AddressUtil.getAddress(this.data.Addresses_LazyLoad, AddressTypes.RESIDENCE);
        this.homePhone = PhoneUtil.getPhone(this.data.Phones_LazyLoad, PhoneTypes.HOME);
        this.workPhone = PhoneUtil.getPhone(this.data.Phones_LazyLoad, PhoneTypes.WORK);
    }

    public changeToNonPrimaryOwnerWhenOtherOwnerIsSetToPrimaryOwner(otherSequenceId: number): void {
        if (this.item.sequenceId != otherSequenceId && this.data.SubRoleId == PRIMARY_OWNER) {
            this.data.SubRoleId = '';
        }
    }
    public onOwnerRoleChange(selectedOption: any): void {
        if (selectedOption.value == PRIMARY_OWNER) {
            this._messagingService.publish(OwnerChangeChannel.OwnerAsPrimaryOwner, this.item.sequenceId);
        }
    }
}

export const OwnerChangeChannel = {
    OwnerAsPrimaryInsured: 'OwnerAsPrimaryInsuredChannel',
    OwnerAsPrimaryOwner: 'OwnerAsPrimaryOwner'
};

const PRIMARY_OWNER: String = 'primary';
