import { Injectable } from '@angular/core';

import { InputValueValidator, InputValueValidationResult } from 'life-core/view-model/validation/input-value';
import { CompareResult } from 'life-core/util/lang';

import { DBDate } from 'ls-core/model';
import { AppSession } from 'ls-core/session';
import { DBDateUtil } from 'ls-core/util';

@Injectable()
export class ApplicationReceivedDateValidator implements InputValueValidator {
    private _appSession: AppSession;

    constructor(appSession: AppSession) {
        this._appSession = appSession;
    }

    public validate(): InputValueValidationResult {
        const isValid = this._appSession.policyDTO.Insureds_LazyLoad.every(applicant =>
            this.isApplicationReceivedDateValid(applicant.BirthDate)
        );

        return isValid ? InputValueValidationResult.pass : InputValueValidationResult.fail;
    }

    private isApplicationReceivedDateValid(birthDate: DBDate): boolean {
        return DBDateUtil.compareDates(this._appSession.policyDTO.ReceiveDate, birthDate) === CompareResult.greater;
    }
}
