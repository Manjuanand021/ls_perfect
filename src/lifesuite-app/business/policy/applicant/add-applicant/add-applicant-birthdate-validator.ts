import { Injectable } from '@angular/core';

import { CompareResult } from 'life-core/util/lang';
import { InputValueValidationResult, InputValueValidator } from 'life-core/view-model/validation/input-value';

import { DBDate } from 'ls-core/model';
import { DBDateUtil } from 'ls-core/util';
import { AppSession } from 'ls-core/session';

@Injectable()
export class AddApplicantBirthDateValidator implements InputValueValidator {
    private _appSession: AppSession;

    constructor(appSession: AppSession) {
        this._appSession = appSession;
    }

    public validate(applicantBirthDate: DBDate): InputValueValidationResult {
        return this.isBirthDateValid(applicantBirthDate)
            ? InputValueValidationResult.pass
            : InputValueValidationResult.fail;
    }

    private isBirthDateValid(applicantBirthDate: DBDate): boolean {
        return (
            this.isApplicationReceivedDateValid(applicantBirthDate) && this.isAgentSignedDateValid(applicantBirthDate)
        );
    }

    private isApplicationReceivedDateValid(applicantBirthDate: DBDate): boolean {
        return (
            DBDateUtil.compareDates(this._appSession.policyDTO.ReceiveDate, applicantBirthDate) ===
            CompareResult.greater
        );
    }

    private isAgentSignedDateValid(applicantBirthDate: DBDate): boolean {
        return (
            !this.agentSignedDateExists() ||
            DBDateUtil.compareDates(this._appSession.policyDTO.AgentSignedDate, applicantBirthDate) ===
                CompareResult.greater
        );
    }

    private agentSignedDateExists(): boolean {
        return DBDateUtil.isDateSet(this._appSession.policyDTO.AgentSignedDate);
    }
}
