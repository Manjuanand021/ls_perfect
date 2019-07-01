import { Component, Injectable } from '@angular/core';

import { IItem, CreateItemEventData } from 'life-core/component/item-list';
import { ItemData } from './item-data';

@Injectable()
export class ItemListDataResolver {

    protected items: IItem<ItemData>[] = [];

    itemsPerType: number = 3;

    public loadItems(): Promise<any> {
        var i: number;

        for (i = 1; i <= this.itemsPerType; i++) {
            this.items.push(this.createItemA(i));
        }
        for (i = 1; i <= this.itemsPerType; i++) {
            this.items.push(this.createItemB(this.itemsPerType + i));
        }
        //this.items[0].selected = true;
        return Promise.resolve(null);
    }

    private createItemA(id: number): IItem<ItemData> {
        return this.createNewItem('typeA', id);
    }

    private createItemB(id: number): IItem<ItemData> {
        return this.createNewItem('typeB', id);
    }

    private createNewItem(type: string, id: number): IItem<ItemData> {
        let itemData: ItemData = this.createData(type, id);
        return null;
        //return this.setupNewItem(itemData);
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
}
