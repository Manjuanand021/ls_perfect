import { Injectable, Injector } from '@angular/core';

import { OwnerTypeComponent } from './owner-type.component';

@Injectable()
export class BaseOwnerTypeComponent extends OwnerTypeComponent {
    constructor(injector: Injector) {
        super(injector);
    }

    public loadData(): Promise<void> {
        this.setResolvedMetaData();
        this.setResolvedListData();
        return Promise.resolve();
    }

    public onAddressCountryIdChange(): void {
        this.listDataUpdater.updateListData({
            rootDTO: this.data,
            currentDTO: this.residentAddress,
            dtoProperty: 'CountryStateId',
            listData: this.listData
        });
    }
}
