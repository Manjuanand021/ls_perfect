import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LfDatePipe } from './lf-date.pipe';
import { LfCurrencyPipe } from './lf-currency.pipe';
import { LfDecimalPipe } from './lf-decimal.pipe';
import { GetListItemsPipe, AddEmptyListItemPipe, SortListItemsPipe, JoinListItemsPipe } from './list.pipe';
import { ListPickerPipe } from './list-picker.pipe';

export const PIPE_EXPORTS: Array<any> = [
    LfDatePipe,
    LfCurrencyPipe,
    LfDecimalPipe,
    GetListItemsPipe,
    AddEmptyListItemPipe,
    SortListItemsPipe,
    JoinListItemsPipe,
    ListPickerPipe
];

@NgModule({
    imports: [CommonModule],
    declarations: [
        LfDatePipe,
        LfCurrencyPipe,
        LfDecimalPipe,
        GetListItemsPipe,
        AddEmptyListItemPipe,
        SortListItemsPipe,
        JoinListItemsPipe,
        ListPickerPipe
    ],
    providers: [LfDatePipe, LfCurrencyPipe, LfDecimalPipe],
    exports: [...PIPE_EXPORTS]
})
export class PipeModule {}
