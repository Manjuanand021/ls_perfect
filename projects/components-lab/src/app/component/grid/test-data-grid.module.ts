import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DataGridModule } from 'life-core/component/grid/data-grid.module';
import { AgGridModule } from 'ag-grid-angular';
import { ComponentsModule } from 'life-core/component/components.module';
import { NgbDropdownModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';

import { TestDataGrid } from './test-data-grid';
import { TestGridColumnsBuilder } from './test-grid-columns.builder';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        DataGridModule,
        AgGridModule,
        NgbDropdownModule,
        NgbTimepickerModule,
        ComponentsModule
    ],
    declarations: [TestDataGrid],
    providers: [TestGridColumnsBuilder]
})
export class TestDataGridModule {}
