import { Injector } from '@angular/core';

import { BaseGridViewModel } from 'life-core/component/grid';

import { PolicyDTO } from 'ls-core/model';
import { PolicySubscriber } from 'ls-core/session';

export abstract class BasePolicyGridViewModel<T> extends BaseGridViewModel<T> {
    public policy: PolicyDTO;

    constructor(injector: Injector) {
        super(injector);
        const policySubscriber = injector.get(PolicySubscriber);
        policySubscriber.subscribe(this, p => {
            this.policy = p;
        });
    }
}
