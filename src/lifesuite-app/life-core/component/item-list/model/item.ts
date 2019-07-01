import { Type } from '@angular/core';

import { ItemSelectedService } from '../service/item-selected.service';

export interface IItem<TItemData = any> {
    // Data object
    data: TItemData;

    // unique Id
    id: string;

    // unique UI sequence Id;
    // sequenceId is not reused when item is deleted from items collection.
    sequenceId: number;

    // Item's index; ordinal number.
    index: number;

    // viewModelType - should be assigned when item is created;
    // This will be used to define item.viewModel (based on item.selected)
    viewModelType: Type<any>;

    // Indicates whether item is currently selected
    selected: boolean;

    // Item valid/invalid state indicator
    invalid: boolean;

    // Message to be displayed on the view
    // after validation, such as invalid message
    message: string;

    // Flag to support css animations
    visible: boolean;

    // Flag to indicate the item was deleted
    deleted: boolean;

    // pub/sub service on 'selected' property
    itemSelectedService: ItemSelectedService;

    // Overridable method to provide custom
    // view strategy if needed
    getViewModelTypeStrategy: (item: IItem<TItemData>) => Type<any>;

    // Utility method;
    // Updates viewModel based on item's state
    updateViewModelType(): void;
}

export class Item<TItemData = any> implements IItem<TItemData> {
    public data: TItemData;

    public id: string;

    public sequenceId: number;

    public index: number;

    public viewModelType: Type<any>;

    public selected: boolean;

    public invalid: boolean;

    public message: string;

    public visible: boolean;

    public deleted: boolean;

    public itemSelectedService: ItemSelectedService;

    public getViewModelTypeStrategy: (item: IItem<TItemData>) => Type<any>;

    constructor(data: any) {
        this.data = data;
        this.itemSelectedService = new ItemSelectedService();
    }

    public updateViewModelType(): void {
        this.viewModelType = this.getViewModelTypeStrategy(this);
    }
}
