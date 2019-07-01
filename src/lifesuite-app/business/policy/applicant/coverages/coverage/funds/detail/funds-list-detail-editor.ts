import { Component, Injector, Injectable } from '@angular/core';
import { BasePolicyDialogDetailViewModel } from 'business/policy/shared/master-detail';
import { ParentChildRegistry } from 'life-core/view-model';
import { AuthorizationProvider } from 'life-core/authorization';

import { FundAllocationDTO } from 'ls-core/model';

import { ApplicantAuthorizationProvider } from 'business/policy/applicant/applicant-authorization.provider';

@Component({
    selector: 'funds-list-detail-editor',
    templateUrl: './funds-list-detail-editor.html',
    providers: [ParentChildRegistry, { provide: AuthorizationProvider, useClass: ApplicantAuthorizationProvider }]
})
@Injectable()
export class FundsListDialogDetailEditor extends BasePolicyDialogDetailViewModel<FundAllocationDTO> {
    public isFundSelectionDisabled: boolean;

    constructor(injector: Injector) {
        super(injector);
    }

    protected setupData(): void {
        this.disableFundSelection();
    }
    private disableFundSelection(): void {
        if (this.data.FundCode) {
            this.isFundSelectionDisabled = true;
        }
    }
}
