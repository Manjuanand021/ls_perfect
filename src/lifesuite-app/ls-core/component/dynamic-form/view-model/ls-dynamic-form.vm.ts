import { Injector } from '@angular/core';

import { DynamicFormViewModel } from 'life-core/component/dynamic-form';

export abstract class LsDynamicFormViewModel extends DynamicFormViewModel {
    constructor(injector: Injector) {
        super(injector);
    }
}
