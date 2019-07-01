import { Injector, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { DataServiceParams, UIServiceNames, UIServiceMethods } from 'ls-core/service';
import { BaseViewDataResolver } from 'ls-core/view-model';
import { DirectDataResolverClass } from 'life-core/component/shared';

@Injectable({ providedIn: 'root' })
export class TeamDataResolver extends BaseViewDataResolver implements DirectDataResolverClass<any[]> {
    constructor(injector: Injector) {
        super(injector);
    }

    protected getServiceParams(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.TEAMLIST,
            serviceMethod: UIServiceMethods.GET_DATA
        });
    }
}
