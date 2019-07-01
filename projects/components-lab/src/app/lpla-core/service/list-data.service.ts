import {Injectable, Injector} from '@angular/core';
import {Http} from '@angular/http';

import {DataResponse, RawDataResponse} from './data-service.model';
import {ListDataResponse} from './list-data-service.model';
import {DataService} from './data.service';
import {Session} from 'life-core/session/session';

@Injectable()
export class ListDataService extends DataService {

 	//logger = LogManager.getLogger('ListDataService');


	/**
	* Creates new list data service instance.
	*/
    constructor(container: Injector) {
        super(container);
    }

	/**
	* Processes service response and creates
	* generic list data response object instance.
	*/
	processResponse(response: RawDataResponse): DataResponse {
		// get generic response data
		let dataResponse: DataResponse = super.processResponse(response);

		// create list data
		let listData: ListDataResponse = new ListDataResponse();
		listData.$type = dataResponse.data.$type;
		listData.DataList = dataResponse.data.DataList;
		listData.TotalRecords = dataResponse.data.TotalRecords;
		listData.Identifier = dataResponse.data.Identifier;

		// log list data for debug
		//this.logger.debug(listData);

		// save list data in generic data response
		dataResponse.data = listData;

		// generic data service response with error messages and list data
		return dataResponse;
	}

}
