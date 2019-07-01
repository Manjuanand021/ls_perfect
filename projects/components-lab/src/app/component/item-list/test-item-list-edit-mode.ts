import { Component, Injectable, Injector, ViewChild } from '@angular/core';

import {
    IItem,
    CreateItemEventData,
    ItemList,
    ItemListViewModel,
    IItemListComponentResolver,
    ItemListButton,
    ItemListButtonType,
    ItemListButtonLabels
} from 'life-core/component/item-list';
import { ItemData } from './item-data';
import { TestComponentResolverEditModeHerlper } from './test-component-resolver-edit-mode.helper';
import { ConfirmDialog, DialogButton, DialogButtonType } from 'life-core/component/dialog';

@Component({
    selector: 'test-item-list-edit-mode',
    templateUrl: './test-item-list-edit-mode.html',
    styleUrls: ['./test-item-list-edit-mode.css']
})
@Injectable()
export class TestItemListEditMode extends ItemListViewModel<ItemData> {
    @ViewChild(ItemList)
    refItemList: ItemList<ItemData>;

    itemsPerType: number = 3;

    private _confirmDialog: ConfirmDialog;

    private nextId: number = 0;

    constructor(container: Injector, confirmDialog: ConfirmDialog) {
        super(container);
        this._confirmDialog = confirmDialog;
        this.editModeOnly = true;
    }

    protected getItemList(): ItemList<ItemData> {
        return this.refItemList;
    }

    protected getButtons(): ItemListButton[] {
        return [
            new ItemListButton({ type: ItemListButtonType.ADD, label: ItemListButtonLabels[ItemListButtonType.ADD] }),
            new ItemListButton({
                type: ItemListButtonType.DELETE,
                label: ItemListButtonLabels[ItemListButtonType.DELETE]
            })
        ];
    }

    protected getItems(): Promise<IItem<ItemData>[]> {
        var i: number;
        const items: IItem<ItemData>[] = [];
        for (i = 1; i <= this.itemsPerType; i++) {
            items.push(this.createItemA(i));
        }
        for (i = 1; i <= this.itemsPerType; i++) {
            items.push(this.createItemB(this.itemsPerType + i));
        }
        //this.items[0].selected = true;
        return Promise.resolve(items);
    }

    protected getItemComponentResolver(): IItemListComponentResolver<ItemData> {
        var resolverHelper = new TestComponentResolverEditModeHerlper();
        return resolverHelper.getResolver(this.editModeOnly);
    }

    protected get itemDataIDPropertyName(): string {
        return 'id';
    }

    private createItemA(id: number): IItem<ItemData> {
        return this.createNewItem('typeA', id);
    }

    private createItemB(id: number): IItem<ItemData> {
        return this.createNewItem('typeB', id);
    }

    private createNewItem(type: string, id: number): IItem<ItemData> {
        const generatedId = this.nextId++;
        let itemData: ItemData = this.createData(type, generatedId);
        return this.setupNewItem(itemData);
    }

    private createData(type: string, id: number): ItemData {
        let name: string = `Item ${type}${id}`;
        return new ItemData(type, id.toString(), name);
    }

    protected createItem(eventData: CreateItemEventData<ItemData>): Promise<any> {
        var data: any = this.createData('typeB', this.generateItemId());
        return Promise.resolve(data);
    }

    generateItemId(): number {
        return Math.floor(Math.random() * 100);
    }

    protected removeItem(item: IItem<ItemData>): Promise<boolean> {
        return this._confirmDialog
            .open({
                message: `Do you want to delete '${item.data.name}'?`,
                title: 'Delete Item',
                buttons: [
                    new DialogButton({ type: DialogButtonType.OK }),
                    new DialogButton({ type: DialogButtonType.CANCEL, options: { isDefault: true } })
                ]
            })
            .then(result => {
                let isRemoved = result.buttonId == DialogButtonType.OK;
                if (isRemoved) {
                    //this._snackBar.open(`'${item.data.name}' was removed.`, 'Close');
                }
                return isRemoved;
            });
    }

    protected getRootObjects(): string[] {
        return [];
    }

    public reload(): void {
        this.reloadItems();
    }
}
