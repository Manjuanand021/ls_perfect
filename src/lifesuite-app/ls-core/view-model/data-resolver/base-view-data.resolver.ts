import { Injector } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { DataService, DataServiceParams } from 'ls-core/service';
import { RouteResolve, DirectResolve } from 'life-core/view-model/data-resolver';
import { ObjectUtil, IDefaultConstructor } from 'life-core/util/lang/object.util';

/**
 *  Base view data resolver class to pre-fetch data for components(ViewModels).
 *  The resolver classes are connected to components via the 'resolve' parameter of a Route.
 */
export abstract class BaseViewDataResolver implements RouteResolve<any>, DirectResolve<any> {
    private _viewDataService: DataService;

    protected resolvedData: any;

    constructor(injector: Injector) {
        this._viewDataService = injector.get(DataService);
    }

    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
        return this.resolveData(route, state);
    }

    public directResolve(): Promise<any> {
        return this.resolveData();
    }

    protected resolveData(route?: ActivatedRouteSnapshot, state?: RouterStateSnapshot): Promise<any> {
        const serviceParams: DataServiceParams = this.getServiceParams(route, state);
        if (serviceParams) {
            return this._viewDataService
                .getData(serviceParams)
                .then(response => {
                    this.setResolvedData(response.responsePayload);
                    return this.resolveAdditionalData().then(() => this.onAllDataResolved());
                })
                .then(() => {
                    return Promise.resolve(this.getResolvedDataToReturn());
                });
        } else {
            return this.resolveAdditionalData().then(() => {
                return Promise.resolve(this.getResolvedDataToReturn());
            });
        }
    }

    protected setResolvedData(responsePayload: any): void {
        const data = this.getDataFromResponse(responsePayload);
        const dataType = this.getCreateObjectType();
        this.resolvedData = data != null && dataType ? ObjectUtil.createObjectOfType(data, dataType) : data;
    }

    protected getServiceParams(route?: ActivatedRouteSnapshot, state?: RouterStateSnapshot): DataServiceParams {
        return null;
    }

    /**
     *  Override to resolve additional data if needed.
     */
    protected resolveAdditionalData(): Promise<any> {
        return this.loadLazyData().then(response => {
            this.handleObjectType();
            return Promise.resolve(this.resolvedData);
        });
    }

    protected loadLazyData(): Promise<any> {
        return Promise.resolve(this.resolvedData);
    }

    /**
     *  Override to convert data objects to their specific classes.
     */
    protected handleObjectType(): void {}

    /**
     *  Override to convert retrieved data object to a specific class.
     */
    protected getCreateObjectType<T>(): IDefaultConstructor<T> {
        return undefined;
    }

    /**
     *  Override to retrieve specific data from response object.
     */
    protected getDataFromResponse(response: any): any {
        return response;
    }

    protected onAllDataResolved(): void {}

    protected getResolvedDataToReturn(): any {
        const resolvedData = this.resolvedData;
        // Reset to release reference.
        this.resolvedData = null;
        return resolvedData;
    }
}
