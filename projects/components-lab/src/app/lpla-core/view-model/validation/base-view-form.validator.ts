import { ViewValidationResponse } from 'life-core/view-model';
//import *  as FormValidatorCreator from './form/form-validator-creator';

export abstract class ViewFormValidatorBase {

    private _validationResponse: ViewValidationResponse;

	protected validator: any; //kendo.ui.Validator;

    protected validateImpl(formId: string, preserveValidator: boolean, hideMessages: boolean): ViewValidationResponse {
        this.initData();
		this.validator = this.getValidator(formId, hideMessages);
        let isValid: boolean = this.validateForm();
        this._validationResponse.hasError = !isValid;
        if (!isValid) {
            this._validationResponse.errorMessages.push(this.getInvalidMessage());
        }
		if (!preserveValidator) {
			this.validator.destroy();
		}
        return this._validationResponse;
    }

	protected getValidator(formId: string, hideMessages: boolean): any { //kendo.ui.Validator {
		//return FormValidatorCreator.getFormValidator(formId, hideMessages);
    }

    protected initData(): void {
        this._validationResponse = new ViewValidationResponse();
    }

    protected validateForm(): boolean {
        if (this.validator != null && this.validator.validate != null) {
            return this.validator.validate();
        }
        return false;
    }

    protected abstract getInvalidMessage(): string;

	public destroy(): void {
		if (this.validator) {
			this.validator.destroy();
		}
	}
}

export interface IViewFormValidatorBase {
    destroy(): void;
}


