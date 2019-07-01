import { ListUtils } from 'lpla-core/util';

/**
* Defines generic list data request type
* for all list data service calls.
*/
export class ListDataRequest {
	static Type: string = 'life.businessService.businessDataModel.request.PagedDataRequest, BusinessDataModel';

	$type: string = ListDataRequest.Type;
	FilterCriterion: any;
	SortBy: any;
	PageSize: number = ListUtils.ListPageSize;
	Start: number = 0;
}

/**
* List data response object.
*/
export class ListDataResponse {

    $type: string;
    DataList: Array<Object>;
    TotalRecords: number;
    Identifier: string;
}
