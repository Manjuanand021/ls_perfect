import { Injectable, Injector } from '@angular/core';
import { Http } from '@angular/http';

import {ILoginRequest} from './login-request.model';
import {Session} from 'life-core/session/session';

import { DataService, DataServiceParams, DataResponse, RawDataResponse, WebServiceAndMethodIds} from 'lpla-core/service';

/**
* User authentication service interface.
*/
export interface IAuthenticationService {
    login(user: ILoginRequest): void;
}


/**
* Default user authentication service.
*/
@Injectable()
export class AuthenticationService extends DataService implements IAuthenticationService {

	/**
	* Creates new authentication service
	* with new user session instance.
	*/
    constructor(container: Injector) {
        super(container);
    }

	/**
	* Processes user login request.
	*/
    login(user: ILoginRequest): Promise<DataResponse> {
		// reset stale user session
		//this.session = new Session(); //.reset();

		// process login request
        let params: DataServiceParams = this.packageServiceParams(user);
        return this.updateData(params);
    }

    private packageServiceParams(user: ILoginRequest): DataServiceParams {
        var params = new DataServiceParams({ webServiceId: WebServiceAndMethodIds.LoginInputDataService, data: user});
        return params;
    }

    protected processResponse(response: RawDataResponse): any {
        let dataResponse: DataResponse = super.processResponse(response);
        this.updateSessionId(response.sessionId);
        return dataResponse;
    }

    private updateSessionId(sessionId: string): void {
		this.session.sessionId = sessionId;
	}
}