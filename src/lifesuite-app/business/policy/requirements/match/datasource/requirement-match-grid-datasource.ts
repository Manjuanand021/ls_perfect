import { Injectable, Injector } from '@angular/core';

import { IGetRowsParams } from 'ag-grid-community';

import { IInfiniteGridDatasource } from 'life-core/component/grid';

import {
    DataServiceParams,
    UIServiceNames,
    UIServiceMethods,
    CompositeFilter,
    DataService,
    PagedDataRequest
} from 'ls-core/service';
import { BaseGridDataSource } from 'business/shared/grid/base-grid-data-source';

import { RequirementTypes } from './../../requirement.type';
import { RequirementFilterModel } from './../requirement-filter.model';

@Injectable()
export class RequirementMatchGridDataSource extends BaseGridDataSource implements IInfiniteGridDatasource {
    private _requirementFilterModel: RequirementFilterModel;
    private _requirementType: RequirementTypes;

    constructor(injector: Injector, requirementTypes: RequirementTypes) {
        super(injector);
        this._requirementType = requirementTypes;
    }

    public updateFilter(filterModel: RequirementFilterModel): void {
        this._requirementFilterModel = filterModel;
        this.resetRowCount();
    }

    protected getRowsServiceParams(params: IGetRowsParams): DataServiceParams {
        if (this.isMVRRequirementGrid()) {
            return new DataServiceParams({
                serviceInterface: UIServiceNames.MVR_MATCHINGREQUIREMENTS_LIST_DATA,
                serviceMethod: UIServiceMethods.GET_DATA,
                requestPayload: this.getMVRRowsPayLoad(params)
            });
        } else {
            return new DataServiceParams({
                serviceInterface: UIServiceNames.LAB_MATCHINGREQUIREMENTS_LIST_DATA,
                serviceMethod: UIServiceMethods.GET_DATA,
                requestPayload: this.getLabRowsPayLoad(params)
            });
        }
    }

    protected getRowCountServiceParams(params: IGetRowsParams): DataServiceParams {
        if (this.isMVRRequirementGrid()) {
            return new DataServiceParams({
                serviceInterface: UIServiceNames.MVR_MATCHINGREQUIREMENTS_LIST_DATA,
                serviceMethod: UIServiceMethods.GET_COUNT,
                requestPayload: this.getMvrRowCountPayLoad(params)
            });
        } else {
            return new DataServiceParams({
                serviceInterface: UIServiceNames.LAB_MATCHINGREQUIREMENTS_LIST_DATA,
                serviceMethod: UIServiceMethods.GET_COUNT,
                requestPayload: this.getLabRowCountPayLoad(params)
            });
        }
    }

    private isMVRRequirementGrid(): boolean {
        return this._requirementFilterModel.requirementType === this._requirementType.mvr;
    }

    private getMVRRowsPayLoad(params: IGetRowsParams): MVRPagedDataRequest {
        const filterCriterion = this.getFilterCriterion(params.filterModel);
        const numOfItems = params.endRow - params.startRow;
        const request = this.mvrBuildRequestPayload(filterCriterion);
        request.startIndex = params.startRow;
        request.numItemsToFetch = numOfItems;
        request.viewType = this._requirementFilterModel.selectedView;
        request.sortFields = this.getSortFieldsForSortModel(params.sortModel);
        return request;
    }

    private getLabRowsPayLoad(params: IGetRowsParams): LabPagedDataRequest {
        const filterCriterion = this.getFilterCriterion(params.filterModel);
        const numOfItems = params.endRow - params.startRow;
        const request = this.labBuildRequestPayload(filterCriterion);
        request.startIndex = params.startRow;
        request.numItemsToFetch = numOfItems;
        request.viewType = this._requirementFilterModel.selectedView;
        request.sortFields = this.getSortFieldsForSortModel(params.sortModel);
        return request;
    }

    private mvrBuildRequestPayload(filterCriterion: CompositeFilter): MVRPagedDataRequest {
        const request = new MVRPagedDataRequest({
            filters: filterCriterion ? filterCriterion.filters : []
        });
        return request;
    }

    private labBuildRequestPayload(filterCriterion: CompositeFilter): LabPagedDataRequest {
        const request = new LabPagedDataRequest({
            filters: filterCriterion ? filterCriterion.filters : []
        });
        return request;
    }

    private getMvrRowCountPayLoad(params: IGetRowsParams): MVRPagedDataRequest {
        const filterCriterion = this.getFilterCriterion(params.filterModel);
        const request = this.mvrBuildRequestPayload(filterCriterion);
        request.viewType = this._requirementFilterModel.selectedView;
        return request;
    }

    private getLabRowCountPayLoad(params: IGetRowsParams): LabPagedDataRequest {
        const filterCriterion = this.getFilterCriterion(params.filterModel);
        const request = this.labBuildRequestPayload(filterCriterion);
        request.viewType = this._requirementFilterModel.selectedView;
        return request;
    }
}

export class MVRPagedDataRequest extends PagedDataRequest {
    public readonly $type: string = 'life.ls.ui.ria.dto.requests.MVRPagedDataRequest, LifeSuite.UIServiceDTO';
    public viewType: string;
}

export class LabPagedDataRequest extends PagedDataRequest {
    public readonly $type: string = 'life.ls.ui.ria.dto.requests.LabPagedDataRequest, LifeSuite.UIServiceDTO';
    public viewType: string;
}
