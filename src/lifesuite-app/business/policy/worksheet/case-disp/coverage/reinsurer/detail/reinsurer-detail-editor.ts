import { Component, Injector, Injectable } from '@angular/core';
import { BasePolicyDialogDetailViewModel } from 'business/policy/shared/master-detail';
import { ParentChildRegistry } from 'life-core/view-model';
import { AuthorizationProvider } from 'life-core/authorization';
import { LfRegularExpressions } from 'life-core/util/regex/lf-regular-expressions';

import { ReinsurerDTO } from 'ls-core/model';

import { CoverageAuthorizationProvider } from './../../coverage-authorization.provider';

@Component({
    selector: 'reinsurer-detail-editor',
    templateUrl: './reinsurer-detail-editor.html',
    providers: [ParentChildRegistry, { provide: AuthorizationProvider, useClass: CoverageAuthorizationProvider }]
})
@Injectable()
export class ReinsurerDialogDetailEditor extends BasePolicyDialogDetailViewModel<ReinsurerDTO> {
    public isReinsurerDisabled: boolean;
    public isRetentionAmountDisabled: boolean;
    public isReinsuranceAmountDisabled: boolean;
    public alphaNumericRegex: RegExp;

    constructor(injector: Injector) {
        super(injector);
        this.isReinsurerDisabled = false;
        this.isRetentionAmountDisabled = false;
        this.isReinsuranceAmountDisabled = false;
        this.alphaNumericRegex = LfRegularExpressions.AlphaNumeric;
    }

    protected setupData(): void {
        this.setReinsurerDisability();
        this.setRetentionAmountDisability();
        this.setReinsuranceAmountDisability();
    }

    private setReinsurerDisability(): void {
        this.isReinsurerDisabled = this.data.CompanyCode ? true : false;
    }

    private setRetentionAmountDisability(): void {
        this.isRetentionAmountDisabled = this.data.RetentionAmount ? true : false;
    }

    private setReinsuranceAmountDisability(): void {
        this.isReinsuranceAmountDisabled = this.data.ReinsuranceAmount ? true : false;
    }
}
