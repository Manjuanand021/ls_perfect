import { Injector, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { IDefaultConstructor } from 'life-core/util/lang';

import { DataServiceParams, UIServiceNames, UIServiceMethods } from 'ls-core/service';
import { Identifiable, BaseModel } from 'ls-core/model';
import { BaseViewDataResolver } from 'ls-core/view-model';
import { ExpandTreeType, DTOLoadByPKWithExpandRequest } from 'ls-core/service/load-bypk';
import { AppSession } from 'ls-core/session/app-session';

@Injectable()
export abstract class BaseDTOPKDataResolver extends BaseViewDataResolver {
    protected appSession: AppSession;

    constructor(injector: Injector) {
        super(injector);
        this.appSession = injector.get(AppSession);
    }

    protected getServiceParams(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.DTO_LOAD,
            serviceMethod: UIServiceMethods.DTO_LOAD,
            requestPayload: this.getRequestPayload()
        });
    }    

    protected abstract getWorkingIdentifier(): Identifiable;

    protected abstract getExpandTree(): ExpandTreeType;

    protected abstract getDataFromResponse(response: any): BaseModel;

    protected abstract getCreateObjectType<T>(): IDefaultConstructor<T>;

    private getRequestPayload(): DTOLoadByPKWithExpandRequest {
        const request = new DTOLoadByPKWithExpandRequest();
        request.WorkingIdentifiable = this.getWorkingIdentifier();
        request.ExpandTree = this.getExpandTree();
        return request;
    }
}
