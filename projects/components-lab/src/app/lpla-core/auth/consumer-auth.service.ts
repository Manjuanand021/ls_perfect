import { Injectable, Injector } from '@angular/core';

import {ILoginRequest, LoginRequest} from './login-request.model';
import {DataService, DataServiceParams, DataResponse, RawDataResponse, WebServiceAndMethodIds} from 'lpla-core/service';
import {Session} from 'life-core/session/session';

export interface IConsumerAuthenticationService {
    login(): void;
}

@Injectable()
export class ConsumerAuthenticationService extends DataService implements IConsumerAuthenticationService {

    private errorHandler: Function;

    private messagesHandler: Function;

    constructor(container: Injector) {
        super(container);
    }

    public setErrorHandler(handler: Function) {
        this.errorHandler = handler;
    }

    public setMessagesHandler(handler: Function) {
        this.messagesHandler = handler;
    }

    login(): Promise<DataResponse> {
        // process login request
        let params: DataServiceParams = this.packageServiceParams();
        return this.updateData(params);
    }

    private packageServiceParams(): DataServiceParams {
        let loginRequest = new LoginRequest("", "");
        loginRequest.bypassSession = true;

        var params = new DataServiceParams(
            {
                webServiceId: WebServiceAndMethodIds.ConsumerLoginInputDataService,
                data: loginRequest
            }
        );
        params.onError =  this.errorHandler;
        params.onMessages = this.messagesHandler;

        return params;
    }

    processResponse(response: RawDataResponse): any {
        let dataResponse: DataResponse = super.processResponse(response);
        this.updateSessionId(response.sessionId);
        return dataResponse;
    }

    private updateSessionId(sessionId: string): void {
        this.session.sessionId = sessionId;
    }
}
