import { Component, Injector, Injectable } from '@angular/core';
import { BasePolicyDialogDetailViewModel } from 'business/policy/shared/master-detail';
import { ParentChildRegistry } from 'life-core/view-model';
import { RelatedPolicyDTO } from 'ls-core/model/dto';
import { AuthorizationProvider } from 'life-core/authorization';
import { ApplicantAuthorizationProvider } from './../../applicant-authorization.provider';

@Component({
    selector: 'other-insurance-cases-detail-editor',
    templateUrl: './other-insurance-cases-detail-editor.html',
    providers: [ParentChildRegistry, { provide: AuthorizationProvider, useClass: ApplicantAuthorizationProvider }]
})
@Injectable()
export class OtherInsuranceCasesDialogDetailEditor extends BasePolicyDialogDetailViewModel<RelatedPolicyDTO> {
    public isReplacement: boolean;

    constructor(injector: Injector) {
        super(injector);
    }

    public setModel(model: any): void {
        super.setModel(model);
        this.updateReplacementFlag();
    }

    public onStatusChange(selectedStatus: any): void {
        this.updateReplacementFlag();
    }

    public updateReplacementFlag(): void {
        this.isReplacement = this.data.Status == '2';
        if (!this.isReplacement) {
            this.data.ReplacementType = null;
        }
    }
}
