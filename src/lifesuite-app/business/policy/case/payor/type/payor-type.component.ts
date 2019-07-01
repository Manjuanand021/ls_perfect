import { Injector, Injectable } from '@angular/core';

import { ViewModel } from 'life-core/view-model';
import { ICompose } from 'life-core/component/compose';
import { IItem } from 'life-core/component/item-list';
import { ListItem } from 'life-core/model';
import { ListDataUpdater } from 'ls-core/service';
import { AddressDTO, AddressTypes, PayorDTO } from 'ls-core/model';
import { AddressUtil } from 'ls-core/util/collection/address.util';

@Injectable()
export class PayorTypeComponent extends ViewModel<PayorDTO> implements ICompose {
    public item: IItem<PayorDTO>;
    public residentAddress: AddressDTO;

    protected listDataUpdater: ListDataUpdater;

    constructor(injector: Injector) {
        super(injector);
        this.listDataUpdater = injector.get(ListDataUpdater);
    }

    public setModel(model: any): void {
        this.data = model;
        this.initAddress();
    }

    public loadData(): Promise<void> {
        this.setResolvedMetaData();
        this.setResolvedListData();
        return Promise.resolve();
    }

    public onAddressCountryIdChange(item: ListItem): void {
        this.listDataUpdater.updateListData({
            rootDTO: this.data,
            currentDTO: this.residentAddress,
            dtoProperty: 'CountryStateId',
            listData: this.listData
        });
    }

    private initAddress(): void {
        this.residentAddress = AddressUtil.getAddress(this.data.Addresses_LazyLoad, AddressTypes.RESIDENCE);
    }
}
