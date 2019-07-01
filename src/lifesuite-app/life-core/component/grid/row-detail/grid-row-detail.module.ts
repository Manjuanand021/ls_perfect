import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GridRowDetailComponent } from './grid-row-detail.component';
import { LfInputsModule } from 'life-core/component/input/lf-inputs.module';

export const GRID_ROW_DETAIL_EXPORTS: Array<any> = [GridRowDetailComponent];

@NgModule({
    imports: [CommonModule, FormsModule, LfInputsModule],
    declarations: [GridRowDetailComponent],
    exports: [...GRID_ROW_DETAIL_EXPORTS]
})
export class GridRowDetailModule {}
