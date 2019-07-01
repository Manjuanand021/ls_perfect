import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AgGridModule, BaseComponentFactory } from 'ag-grid-angular/main';

import { DataGrid } from './data-grid';
import { DataGridFilterModule, DATA_GRID_FILTER_COMPONENTS } from './filter/data-grid-filter.module';
import { GridRowDetailModule } from './row-detail/grid-row-detail.module';
import { NoRowsOverlayComponent } from './overlay/no-rows-overlay.component';
import { GridRowDetailComponent } from './row-detail/grid-row-detail.component';

export const DATA_GRID_EXPORTS: Array<any> = [DataGrid];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        DataGridFilterModule,
        GridRowDetailModule,
        AgGridModule.withComponents(DATA_GRID_FILTER_COMPONENTS)
    ],
    declarations: [DataGrid, NoRowsOverlayComponent],
    entryComponents: [NoRowsOverlayComponent, GridRowDetailComponent],
    exports: [...DATA_GRID_EXPORTS],
    providers: [BaseComponentFactory]
})
export class DataGridModule {}
