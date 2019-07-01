import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ComposeModule } from 'life-core/component/compose/compose.module';
import { LfButtonModule, LF_BUTTON_EXPORTS } from 'life-core/component/button/lf-button.module';
import { ItemList } from './item-list';

export const ITEMLIST_EXPORTS: Array<any> = [ItemList];

@NgModule({
    imports: [CommonModule, FormsModule, ComposeModule, LfButtonModule],
    declarations: [ItemList],
    exports: [...ITEMLIST_EXPORTS, ...LF_BUTTON_EXPORTS]
})
export class ItemListModule {}
