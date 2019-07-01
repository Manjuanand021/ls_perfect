import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataGridStatusBar } from './data-grid-status-bar';
import { LfInputsModule } from 'life-core/component/input/lf-inputs.module';

export const DATA_GRID_STATUS_BAR_EXPORTS: Array<any> = [DataGridStatusBar];

@NgModule({
    imports: [FormsModule, LfInputsModule],
    declarations: [DataGridStatusBar],
    exports: [...DATA_GRID_STATUS_BAR_EXPORTS]
})
export class DataGridStatusBarModule {}
