import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { BusinessServiceAndMethodIds, DataService, ViewDataService } from 'lpla-core/service';
import { DataConfigUrlRequest } from './data-config-url.request';
import { FieldDataManager } from './field-data.manager';

/**
 * Loads Field Data based on *.dat file information.
 * Used as a Resolve class in the Routing table for EditorViewModel-derived classes.
 */
@Injectable()
export class FieldDataResolver implements Resolve<FieldDataManager> {
    constructor(private _dataService: DataService, private _viewDataService: ViewDataService) {}

    // Sample class to pre-load fields data using Resolver.
    // Note: this WILL NOT work for statically nested views
    // because they are not described in the routing table.
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<FieldDataManager> {
        let fieldDataFileUrl = this.getFieldDataFileUrl(route, state);
        let payload = this.getDataConfigUrlRequest();
        let fieldDataManager = new FieldDataManager(this._viewDataService, this._dataService);
        return fieldDataManager
            .load(
                this.getFieldDataFileUrl(route, state),
                BusinessServiceAndMethodIds.TemplateFieldDataService,
                BusinessServiceAndMethodIds.Method_Get,
                payload
            )
            .then(result => {
                return fieldDataManager;
            });
    }

    private getFieldDataFileUrl(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): string {
        let url: string = (<any>route.component).FieldDataFileUrl;
        if (!url) {
            throw new Error('Undefined FieldDataFileUrl.');
        }
        return url;
    }

    protected getDataConfigUrlRequest(): DataConfigUrlRequest {
        let dataConfigUrlRequest = new DataConfigUrlRequest();
        return dataConfigUrlRequest;
    }
}
