import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';

import { MockBackendServiceInterceptor } from 'life-core/testing/mock-backend';
import { LsMockBackendService, LplaMockBackendService } from './mock-backend.service';

import {
    UIRequest,
    UIResponse,
    DataServiceParams as LsDataServiceParams,
    ServiceUrls as LsServiceUrls
} from 'ls-core/service';
import {
    DataRequest,
    DataResponse,
    DataServiceParams as LplaDataServiceParams,
    ServiceUrls as LplaServiceUrls
} from 'lpla-core/service';

@Injectable()
export class LsMockBackendServiceInterceptor extends MockBackendServiceInterceptor<
    UIRequest,
    UIResponse,
    LsDataServiceParams
> {
    constructor(mockBackendService: LsMockBackendService) {
        super(mockBackendService);
    }

    protected needToProcess(request: HttpRequest<any>): boolean {
        return request.url.startsWith(LsServiceUrls.AppRootUrl);
    }
}

@Injectable()
export class LplaMockBackendServiceInterceptor extends MockBackendServiceInterceptor<
    DataRequest,
    DataResponse,
    LplaDataServiceParams
> {
    constructor(mockBackendService: LplaMockBackendService) {
        super(mockBackendService);
    }

    protected needToProcess(request: HttpRequest<any>): boolean {
        return request.url.startsWith(LplaServiceUrls.AppRootUrl);
    }
}
