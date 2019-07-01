import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';

import { MockBackendService } from 'life-core/testing/mock-backend';

import {
    ServiceUrls as LsServiceUrls,
    DataServiceParams as LsDataServiceParams,
    UIRequest,
    UIResponse
} from 'ls-core/service';
import {
    ServiceUrls as LplaServiceUrls,
    DataRequest,
    DataResponse,
    DataServiceParams as LplaDataServiceParams
} from 'lpla-core/service';
import { LsMockResponseResolver, LplaMockResponseResolver } from './mock-response-resolver';

@Injectable()
export class LsMockBackendService extends MockBackendService<UIRequest, UIResponse, LsDataServiceParams> {
    protected createMockResponseResolver(): LsMockResponseResolver {
        return new LsMockResponseResolver();
    }

    protected isApplicationRequest(request: HttpRequest<any>): boolean {
        return request.url.startsWith(LsServiceUrls.AppRootUrl);
    }

    protected getMockResponse(responsePayload: any): UIResponse {
        const mockResponse = new UIResponse();
        mockResponse.responsePayload = responsePayload;
        mockResponse.formattedErrors = [];
        return mockResponse;
    }
}

@Injectable()
export class LplaMockBackendService extends MockBackendService<DataRequest, DataResponse, LplaDataServiceParams> {
    protected createMockResponseResolver(): LplaMockResponseResolver {
        return new LplaMockResponseResolver();
    }

    protected isApplicationRequest(request: HttpRequest<any>): boolean {
        return request.url.startsWith(LplaServiceUrls.AppRootUrl);
    }

    protected getMockResponse(responsePayload: any): DataResponse {
        const mockResponse = new DataResponse();
        mockResponse.templateResponseList = responsePayload.templateResponseList;
        mockResponse.data = responsePayload.payLoad;
        mockResponse.messages = [];
        return mockResponse;
    }
}
