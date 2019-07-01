import { Component, Injector, Injectable } from '@angular/core';

import { ItemViewModel } from 'life-core/component/item-list';
import { ItemListAnimations } from 'life-core/component/item-list';
import { ItemData } from '../item-data';

@Component({
    selector: 'item-b',
    templateUrl: './item-b.html',
    animations: ItemListAnimations
})
@Injectable()
export class ItemB extends ItemViewModel<ItemData> {
    constructor(container: Injector) {
        super(container);
    }
}
