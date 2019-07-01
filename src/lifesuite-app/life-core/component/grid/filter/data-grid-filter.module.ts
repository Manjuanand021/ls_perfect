import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LfButtonModule } from 'life-core/component/button/lf-button.module';
import { LfInputsModule } from 'life-core/component/input/lf-inputs.module';
import { LfFormsModule } from 'life-core/component/form/lf-forms.module';
import { PipeModule } from 'life-core/util/pipe/pipe.module';
import { TextFilterComponent } from './text-filter/text-filter.component';
import { NumericFilterComponent } from './numeric-filter/numeric-filter.component';
import { DateFilterComponent } from './date-filter/date-filter.component';
import { ServerFilterModelBuilder } from './builder';

export const DATA_GRID_FILTER_COMPONENTS: Array<any> = [
    TextFilterComponent,
    NumericFilterComponent,
    DateFilterComponent
];

@NgModule({
    imports: [CommonModule, FormsModule, LfButtonModule, LfFormsModule, LfInputsModule, PipeModule],
    declarations: [TextFilterComponent, NumericFilterComponent, DateFilterComponent],
    exports: [...DATA_GRID_FILTER_COMPONENTS],
    providers: [ServerFilterModelBuilder]
})
export class DataGridFilterModule {}
