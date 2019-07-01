import { Component, Injector, Injectable } from '@angular/core';

import { ViewModel } from 'life-core/view-model';

@Component({
    selector: 'applicant-detail',
    templateUrl: './applicant-detail.component.html'
})
@Injectable()
export class ApplicantDetailComponent extends ViewModel {
    constructor(injector: Injector) {
        super(injector);
    }
}
