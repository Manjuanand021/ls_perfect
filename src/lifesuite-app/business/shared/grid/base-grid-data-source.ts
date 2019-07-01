import { Injector } from '@angular/core';

import { IGetRowsParams } from 'ag-grid-community';

import { IServerFilter } from 'life-core/service';
import {
    IGridDataSource,
    IDataGridContext,
    ServerFilterModelBuilder,
    GridFilter,
    GridState
} from 'life-core/component/grid';

import { DataService, DataServiceParams, CompositeFilter, SortField, SortFieldOrder } from 'ls-core/service';

import { CompositeFields } from 'business/shared/composite-fields';

export abstract class BaseGridDataSource implements IGridDataSource {
    public rowCount: number;
    protected dataService: DataService;
    protected serverFilterModelBuilder: ServerFilterModelBuilder;

    constructor(injector: Injector) {
        this.dataService = injector.get(DataService);
        this.serverFilterModelBuilder = injector.get(ServerFilterModelBuilder);
    }

    public getRows(params: IGetRowsParams): void {
        const onGetRowsComplete = (rows: Array<any>, rowCount: number) => {
            params.successCallback(rows, rowCount);
            (params.context as IDataGridContext).hostComponent.onGetRowsComplete({
                gridState: new GridState({
                    sortModel: params.sortModel,
                    filterModel: params.filterModel
                }),
                rows: rows,
                rowCount: rowCount
            });
        };
        this.getRowCountIfNeeded(params).then(rowCount => {
            if (rowCount > 0) {
                const serviceParams: DataServiceParams = this.getRowsServiceParams(params);
                this.dataService.getData(serviceParams).then(response => {
                    const rows = response.responsePayload as Array<any>;
                    onGetRowsComplete(rows, rowCount);
                });
            } else {
                onGetRowsComplete([], rowCount);
            }
        });
    }

    protected getRowCountIfNeeded(params: IGetRowsParams): Promise<number> {
        if (!this.rowCount) {
            const serviceParams: DataServiceParams = this.getRowCountServiceParams(params);
            return this.dataService.getData(serviceParams).then(response => {
                const rowCount = response.responsePayload as number;
                this.setRowCount(rowCount);
                return rowCount;
            });
        } else {
            return Promise.resolve(this.rowCount);
        }
    }

    // override in child class
    protected abstract getRowCountServiceParams(params: IGetRowsParams): DataServiceParams;

    protected setRowCount(rowCount: number): void {
        this.rowCount = rowCount;
    }

    // override in child class
    protected abstract getRowsServiceParams(params: IGetRowsParams): DataServiceParams;

    protected getSortFieldsForSortModel(sortModel: any): Array<SortField> {
        const sortFieldForSortModel = [];
        sortModel.forEach(field => {
            const sortOrder: number = SortFieldOrder.getSortOrder(field.sort);
            const sortFields = this.getSortFieldsForSortModelField(field.colId, sortOrder);
            sortFieldForSortModel.push(...sortFields);
        });
        return sortFieldForSortModel;
    }

    private getSortFieldsForSortModelField(fieldId: string, sortOrder: number): Array<SortField> {
        const mappedFields: string[] = CompositeFields.getFieldMap(fieldId);
        return mappedFields.map(mappedField => {
            return new SortField(mappedField, sortOrder);
        });
    }

    protected getFilterCriterion(gridFilters: any): CompositeFilter {
        const filterCriterion: CompositeFilter = this.getFilterModelsForGridFilters(gridFilters);
        const externalFilters = this.getExternalFilters();
        if (externalFilters && externalFilters.filters) {
            // MT expects external filters to be at the top of the list
            filterCriterion.filters.unshift(...externalFilters.filters);
        }
        return filterCriterion;
    }

    protected getFilterModelsForGridFilters(gridFilters: any): CompositeFilter {
        const filterModels = new CompositeFilter([]);
        Object.keys(gridFilters).forEach(gridFilterName => {
            const filterModelForGridFilter = this.getFilterModelForGridFilter(
                gridFilterName,
                gridFilters[gridFilterName]
            );
            if (filterModelForGridFilter) {
                filterModels.filters.push(filterModelForGridFilter);
            }
        });
        return filterModels;
    }

    protected getFilterModelForGridFilter(field: string, gridFilter: GridFilter): IServerFilter {
        const mappedFields: string[] = CompositeFields.getFieldMap(field);
        return this.serverFilterModelBuilder.build(mappedFields, gridFilter);
    }

    protected getExternalFilters(): CompositeFilter {
        // override in child class if need to provide external filters in additional to grid column filters
        return null;
    }

    protected resetRowCount(): void {
        this.rowCount = undefined;
    }
}
