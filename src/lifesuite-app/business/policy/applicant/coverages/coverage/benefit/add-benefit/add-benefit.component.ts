import { Component, Injector } from '@angular/core';

import { ViewModel, ParentChildRegistry, ViewValidationResult } from 'life-core/view-model';
import { ICompose, IDialogViewModel, DialogViewModelResult, DialogData } from 'life-core/component';
import { DialogButton, ConfirmDialog, DialogButtonType } from 'life-core/component/dialog';
import { AuthorizationProvider } from 'life-core/authorization';
import { I18n } from 'life-core/i18n';

import { BenefitDTO, PolicyCoverageDTO, Identifiable } from 'ls-core/model';

import { CoverageStatuses } from 'business/policy/shared';
import { ApplicantAuthorizationProvider } from 'business/policy/applicant/applicant-authorization.provider';

@Component({
    selector: 'add-benefit.component',
    templateUrl: './add-benefit.component.html',
    providers: [ParentChildRegistry, { provide: AuthorizationProvider, useClass: ApplicantAuthorizationProvider }]
})
export class AddBenefitComponent extends ViewModel implements ICompose, IDialogViewModel {
    public resolvedData: any;
    public benefitId: number;
    private _benefit: BenefitDTO;
    private _policyCoverage: PolicyCoverageDTO;
    private _confirmDialog: ConfirmDialog;

    constructor(injector: Injector, confirmDialog: ConfirmDialog, i18n: I18n) {
        super(injector);
        this._confirmDialog = confirmDialog;
        this._benefit = new BenefitDTO();
        this._benefit.identifier = new Identifiable();
        this.i18n = i18n;
    }

    public setModel(model: DialogData): void {
        this.resolvedData = model.resolvedData;
        this._policyCoverage = model.parameterData;
    }

    public onDialogButtonClick(buttonId: string): Promise<DialogViewModelResult> {
        if (buttonId == DialogButtonType.ACCEPT) {
            return this.validate().then(result => {
                if (result == ViewValidationResult.pass) {
                    if (!this.isExistingBenefit()) {
                        this.addBenefit();
                        return new DialogViewModelResult(this._benefit, true);
                    } else {
                        this.showDuplicateBenefitErrorMessage();
                    }
                } else {
                    return new DialogViewModelResult(null, false);
                }
            });
        } else {
            return Promise.resolve(null);
        }
    }

    private isExistingBenefit(): boolean {
        return this._policyCoverage.Benefits_LazyLoad.find(benefit => benefit.BenefitId == this.benefitId) != null;
    }

    private showDuplicateBenefitErrorMessage(): void {
        this._confirmDialog.open({
            message: this.i18n({
                value: 'Benefit already exists. Pick a different one.',
                id: 'applicant.coverage.benefit.alreadyexistsmsg'
            }),
            title: this.i18n({ value: 'Information', id: 'applicant.coverage.benefit.informationtitle' }),
            buttons: [new DialogButton({ type: DialogButtonType.OK })]
        });
    }

    private addBenefit(): void {
        this._benefit.BenefitId = this.benefitId;
        this._benefit.PolicyCoverageId = this._policyCoverage.PolicyCoverageId;
        this._benefit.CoverageStatus = CoverageStatuses.PENDING;
        this._benefit.BenefitParties_LazyLoad = [];
        this._policyCoverage.Benefits_LazyLoad.push(this._benefit);
    }
}
