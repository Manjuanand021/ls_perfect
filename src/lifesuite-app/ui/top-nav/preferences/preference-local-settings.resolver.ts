import { Injectable, Injector } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { BaseViewDataResolver } from 'ls-core/view-model';

import { ILocalSettingsService, LocalSettingsService } from 'life-core/local-settings/local-settings.service';
import { UserLocalSettings } from 'life-core/local-settings';

@Injectable()
export class PreferenceLocalSettingsResolver extends BaseViewDataResolver {
    private _localSettingsService: ILocalSettingsService;

    constructor(injector: Injector, localSettingsService: LocalSettingsService) {
        super(injector);
        this._localSettingsService = localSettingsService;
    }

    protected resolveData(route?: ActivatedRouteSnapshot, state?: RouterStateSnapshot): Promise<any> {
        this.resolvedData = this._localSettingsService.getAllUserSettings<UserLocalSettings>(UserLocalSettings);
        return Promise.resolve(this.getResolvedDataToReturn());
    }
}
