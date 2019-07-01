import { Injectable } from '@angular/core';

import { CompareResult } from 'life-core/util/lang';
import { InputValueValidator, InputValueValidationResult } from 'life-core/view-model/validation/input-value';

import { DBDate } from 'ls-core/model';
import { AppSession } from 'ls-core/session';
import { DBDateUtil } from 'ls-core/util';

@Injectable()
export class AgentSignedDateValidator implements InputValueValidator {
    private _appSession: AppSession;

    constructor(appSession: AppSession) {
        this._appSession = appSession;
    }

    public validate(): InputValueValidationResult {
        const isValid =
            !this.agentSignedDateExists() ||
            this._appSession.policyDTO.Insureds_LazyLoad.every(applicant =>
                this.isAgentSignedDateValid(applicant.BirthDate)
            );

        return isValid ? InputValueValidationResult.pass : InputValueValidationResult.fail;
    }

    private agentSignedDateExists(): boolean {
        return DBDateUtil.isDateSet(this._appSession.policyDTO.AgentSignedDate);
    }

    private isAgentSignedDateValid(birthDate: DBDate): boolean {
        return DBDateUtil.compareDates(this._appSession.policyDTO.AgentSignedDate, birthDate) === CompareResult.greater;
    }
}
