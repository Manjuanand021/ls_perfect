import { Injectable } from '@angular/core';

import {DataService, DataServiceParams, DataResponse, WebServiceAndMethodIds } from 'lpla-core/service';

/**
* Set root object request type for setting root object for all the data calls.
*/
class RegisterRootObjectRequest {
    // set root object request type for the service call
    static Type: string = 'life.businessService.businessDataModel.request.RegisterRootObjectRequest, BusinessDataModel';

    // set root object request data for the service call
    $type: string = RegisterRootObjectRequest.Type;
    rootObjectName: string;
    rootObjectId: string;

	/**
	* Creates new set root object request
	*
	* @param rootObjectName Name of the root object, i.e. Person.
	* @param rootObjectId ID/guid of the root object, i.e. person.ID.
	*/
    constructor(rootObjectName: string, rootObjectId: string) {
        this.rootObjectName = rootObjectName;
        this.rootObjectId = rootObjectId;
    }
}

/**
* Set root object request type for setting root object for all the data calls.
*/
@Injectable()
export class RootObjectSetter {

    private dataService: DataService;

    constructor(dataService: DataService) {
        this.dataService = dataService;
    }

	/**
	* Sets root object 
	*
	* @param RootObjectType Type of the root object, i.e. Person.
	* @param rootObjectId ID/guid of the root object, i.e. person.ID.
	*/
    set(rootObjectType: string, rootObjectId: string): Promise<DataResponse> {
        let params: DataServiceParams =
            this.packageServiceParams(new RegisterRootObjectRequest(rootObjectType, rootObjectId)
            );
        return this.dataService.updateData(params);
    }

    private packageServiceParams(data: RegisterRootObjectRequest): DataServiceParams {
        var params = new DataServiceParams({webServiceId: WebServiceAndMethodIds.RegisterRootObjectInputDataService, data: data});
        return params;
    }
}

// data model object type to register as root object
export class RootObjectTypes {
    // with root object data service for getting person data
    static Person: string = 'Person';
    static Scene: string = 'Scene';
    static Beneficiary: string = 'Beneficiary';
}
