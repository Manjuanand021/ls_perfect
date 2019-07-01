import { Component, Injector, Injectable } from '@angular/core';
import { BasePolicyDialogDetailViewModel } from 'business/policy/shared/master-detail';
import { FamilyHistoryDTO } from 'ls-core/model/dto';
import { ParentChildRegistry } from 'life-core/view-model';
import { AuthorizationProvider } from 'life-core/authorization';
import { ApplicantAuthorizationProvider } from 'business/policy/applicant/applicant-authorization.provider';

@Component({
    selector: 'family-history-detail-editor',
    templateUrl: './family-history-detail-editor.html',
    providers: [ParentChildRegistry, { provide: AuthorizationProvider, useClass: ApplicantAuthorizationProvider }]
})
@Injectable()
export class FamilyHistoryDialogDetailEditor extends BasePolicyDialogDetailViewModel<FamilyHistoryDTO> {
    constructor(injector: Injector) {
        super(injector);
    }
}
