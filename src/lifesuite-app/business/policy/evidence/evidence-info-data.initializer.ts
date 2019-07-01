import { Injectable, Injector } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { CollectionUtil } from 'life-core/util';

import { NoteDTO } from 'ls-core/model';

import { BasePolicyDataResolver } from 'business/policy/shared';

@Injectable()
export class EvidenceInfoDataInitializer extends BasePolicyDataResolver {
    constructor(injector: Injector) {
        super(injector);
    }

    protected resolveData(route?: ActivatedRouteSnapshot, state?: RouterStateSnapshot): Promise<any> {
        this.initializeData();
        return Promise.resolve();
    }

    // initialize collection if collection is not defined
    private initializeData(): void {
        this.policy.Notes_LazyLoad = CollectionUtil.getNewCollection<NoteDTO>(this.policy.Notes_LazyLoad);
    }
}
