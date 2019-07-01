import { Component, Injector, ViewChild, Type, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { IItemComponentResolver } from 'life-core/component/shared';
import { Compose } from 'life-core/component/compose';
import { IBaseDataManager, BaseDataManager } from '../manager/base-data-manager';
import { MasterDetailComponentResolver } from '../resolver/master-detail-component.resolver';

@Component({
    selector: 'detail',
    templateUrl: './detail.html',
    styleUrls: ['./detail.css']
})
export class Detail implements AfterViewInit, OnDestroy {
    public oItem: Observable<any>;

    // Currenlty Selected item
    public item: any;

    public itemComponentType: Type<any>;

    private _dataManager: IBaseDataManager<any>;

    private _itemComponentResolver: IItemComponentResolver<any>;

    private _subscription: Subscription;

    // Compose references for the item
    @ViewChild(Compose)
    private refCompose: Compose;

    constructor(baseDataManager: BaseDataManager, itemComponentResolver: MasterDetailComponentResolver) {
        this._dataManager = baseDataManager;
        this._itemComponentResolver = itemComponentResolver;
    }

    public ngAfterViewInit(): void {
        this.oItem = this._dataManager.getSelectedItem();
        this._subscription = this.oItem.subscribe(selectedItem => {
            this.item = selectedItem;
            const selectedItemComponentType = this._itemComponentResolver.resolve(selectedItem);
            if (this.itemComponentType != selectedItemComponentType) this.itemComponentType = selectedItemComponentType;
        });
    }

    public getItemViewModel(): any {
        return this.refCompose.component;
    }

    public ngOnDestroy(): void {
        this._subscription.unsubscribe();
    }
}
