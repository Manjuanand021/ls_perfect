import { Injectable } from '@angular/core';

import { InputValueValidationResult, InputValueValidator } from 'life-core/view-model/validation/input-value';

import { ApplicationReceivedDateValidator } from 'business/policy/shared/validator/application-received-date-validator';
import { AgentSignedDateValidator } from 'business/policy/shared/validator/agent-signed-date-validator';

@Injectable()
export class BirthDateValidatorDelegate implements InputValueValidator {
    private _applicationReceivedDateValidator: ApplicationReceivedDateValidator;
    private _agentSignedDateValidator: AgentSignedDateValidator;
    constructor(
        applicationReceivedDateValidator: ApplicationReceivedDateValidator,
        agentSignedDateValidator: AgentSignedDateValidator
    ) {
        this._applicationReceivedDateValidator = applicationReceivedDateValidator;
        this._agentSignedDateValidator = agentSignedDateValidator;
    }

    public validate(): InputValueValidationResult {
        return this.isBirthdateValid() ? InputValueValidationResult.pass : InputValueValidationResult.fail;
    }

    private isBirthdateValid(): boolean {
        return (
            this._applicationReceivedDateValidator.validate() === InputValueValidationResult.pass &&
            this._agentSignedDateValidator.validate() === InputValueValidationResult.pass
        );
    }
}
