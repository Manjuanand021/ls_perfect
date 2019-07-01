import { Injector, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { DataServiceParams, UIServiceNames, UIServiceMethods } from 'ls-core/service';
import { BaseViewDataResolver } from 'ls-core/view-model';

@Injectable()
export class UserTeamDataResolver extends BaseViewDataResolver {
    constructor(injector: Injector) {
        super(injector);
    }

    protected getServiceParams(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.USER_TEAM_LIST,
            serviceMethod: UIServiceMethods.GET_DATA
        });
    }
}
