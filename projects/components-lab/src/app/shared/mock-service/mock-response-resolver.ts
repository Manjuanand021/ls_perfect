import { MockResponseResolver, MockResponseRegistration, MAP_KEY_DELIMITER } from 'life-core/testing/mock-backend';
import { DataServiceParams as LsDataServiceParams, UIRequest } from 'ls-core/service';
import { DataRequest, DataServiceParams as LplaDataServiceParams } from 'lab/lpla-core/service';
import { LsMockResponseRegistration, LplaMockResponseRegistration } from './mock-response/mock-response-registration';
import * as jsonUtil from 'life-core/util/json/json.util';

export class LsMockResponseResolver extends MockResponseResolver<UIRequest, LsDataServiceParams> {
    protected createMockResponseRegistration(): MockResponseRegistration<LsDataServiceParams> {
        return new LsMockResponseRegistration();
    }

    protected createRequest(dataParams: LsDataServiceParams): UIRequest {
        return new UIRequest({
            serviceInterface: dataParams.serviceInterface,
            serviceMethod: dataParams.serviceMethod,
            requestPayload: dataParams.requestPayload
        });
    }

    protected getKey(request: UIRequest): string {
        const preparedRequest: UIRequest = request.requestPayload ? jsonUtil.removeCircularRefs(request) : null;
        const requestAsString = preparedRequest ? JSON.stringify(preparedRequest.requestPayload) : '';
        return `${request.serviceInterface}${MAP_KEY_DELIMITER}${
            request.serviceMethod
        }${MAP_KEY_DELIMITER}${requestAsString}`;
    }
}

export class LplaMockResponseResolver extends MockResponseResolver<DataRequest, LplaDataServiceParams> {
    protected createMockResponseRegistration(): MockResponseRegistration<LplaDataServiceParams> {
        return new LplaMockResponseRegistration();
    }

    protected createRequest(dataParams: LplaDataServiceParams): DataRequest {
        return new DataRequest(dataParams);
    }

    protected getKey(request: DataRequest): string {
        return `${request.webServiceId}${MAP_KEY_DELIMITER}${request.webMethodId}${MAP_KEY_DELIMITER}${
            request.serviceId
        }${MAP_KEY_DELIMITER}${request.methodId}${MAP_KEY_DELIMITER}${request.targetPageId}`;
    }
}
