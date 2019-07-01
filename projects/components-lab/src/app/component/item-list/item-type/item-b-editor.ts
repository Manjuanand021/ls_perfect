import { Component, Injector, Injectable } from '@angular/core';

import { FieldDataManager } from 'lpla-core/field';
import { ItemEditor } from './item-editor';
import { ItemListAnimations } from 'life-core/component/item-list';

@Component({
    selector: 'item-b-editor',
    templateUrl: './item-b-editor.html',
    providers: [FieldDataManager],
    animations: ItemListAnimations
})
@Injectable()
export class ItemBEditor extends ItemEditor {
    constructor(container: Injector) {
        super(container);
    }
}
