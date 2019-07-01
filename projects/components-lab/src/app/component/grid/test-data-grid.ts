import { Component, Injector, Injectable } from '@angular/core';

import { ViewModel, ParentChildRegistry } from 'life-core/view-model';
import {
    IDataGridOptions,
    IGridColumnsBuilder,
    DataGridColumns,
    IDataGridViewModel,
    DataGridOptionsUtil,
    GridFilterFrameworkComponents
} from 'life-core/component/grid';
import { DataGridCommonOptions } from 'life-core/component/grid';
import { TestGridColumnsBuilder } from './test-grid-columns.builder';

@Component({
    selector: 'test-data-grid',
    templateUrl: './test-data-grid.html',
    providers: [ParentChildRegistry]
})
@Injectable()
export class TestDataGrid extends ViewModel implements IDataGridViewModel {
    gridOptions: IDataGridOptions;

    gridData: any[];

    columnsBuilder: IGridColumnsBuilder;

    countries: string[] = ['US', 'Germany', 'UK', 'Japan', 'Italy', 'Greece'];

    public selectedRows: any[];

    constructor(injector: Injector, columnsBuilder: TestGridColumnsBuilder) {
        super(injector);
        this.columnsBuilder = columnsBuilder;
        this.gridOptions = this.getGridOptions();
    }

    getGridColumns(): DataGridColumns {
        return this.columnsBuilder.build();
    }

    getGridOptions(): IDataGridOptions {
        let gridColumns: DataGridColumns = this.getGridColumns();
        this.generateData();
        return DataGridOptionsUtil.getGridOptions(
            {
                columnDefs: gridColumns.getLayout(),
                rowData: this.gridData,
                rowSelection: 'single',
                enableColResize: true,
                enableFilter: true,
                frameworkComponents: GridFilterFrameworkComponents,
                //pagination: true,
                //paginationAutoPageSize: true,
                checkboxColumn: true,
                getRowNodeId: function(data) {
                    return data.id;
                }
            },
            DataGridCommonOptions
        );
    }

    generateData() {
        // generate some random data
        const salesDate = new Date('1/1/2010');
        this.gridData = [];
        for (var i = 0; i < 100; i++) {
            this.gridData.push({
                id: i + 1,
                country: `${this.countries[Math.floor(i % this.countries.length)]} and some long string`,
                downloads: Math.round(Math.random() * 20000),
                sales: Math.floor(Math.random() * 1000000) / 100,
                date: new Date(
                    salesDate.getFullYear(),
                    salesDate.getMonth() + i / this.countries.length,
                    salesDate.getDate()
                )
            });
        }
    }

    public onRowSelected(event): void {
        this.selectedRows = this.gridOptions.api.getSelectedRows();
    }

    ngAfterViewInit(): void {
        super.ngAfterViewInit();
        // this.setFilters();
    }

    setFilters(): void {
        let filterComponent = this.gridOptions.api.getFilterInstance('date');
        filterComponent.setModel({
            type: 'inRange'
        });
    }
}
