import { Injectable, Injector } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { BaseViewDataResolver } from 'ls-core/view-model';
import { DataServiceParams, UIServiceNames, UIServiceMethods } from 'ls-core/service';

@Injectable()
export class LifeSuiteVersionResolver extends BaseViewDataResolver {
    constructor(injector: Injector) {
        super(injector);
    }

    protected getServiceParams(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.VERSION_NUMBER_SERVICE,
            serviceMethod: UIServiceMethods.GET_VERSION_NUMBER
        });
    }
}
