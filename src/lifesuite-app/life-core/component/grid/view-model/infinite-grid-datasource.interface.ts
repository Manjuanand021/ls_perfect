import { IDatasource } from 'ag-grid-community';

export interface IInfiniteGridDatasource extends IDatasource {
    updateFilter(filterModel: any): void;
}
