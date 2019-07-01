import { Injectable, Injector, Optional } from '@angular/core';

import { IViewModel, ViewValidationResponse} from 'life-core/view-model';
import { IViewDataValidator, ViewDataValidator, ViewValidationParams} from './view-data.validator';
import { IViewFormValidator, ViewFormValidator} from './view-form.validator';
import { IViewServerRulesValidator, ViewServerRulesValidator} from './view-server-rules.validator';

@Injectable()
export class ViewValidator implements IViewValidator {

    protected container: Injector;

    protected _viewValidationParams: ViewValidationParams;

    protected _dataValidator: IViewDataValidator;

    protected _formValidator: IViewFormValidator;

    protected _serverRulesValidator: IViewServerRulesValidator;

    private _validationResponse: ViewValidationResponse;

    constructor(container: Injector) {
        this.container = container;
	}

    public validate(viewValidationParams: ViewValidationParams): Promise<ViewValidationResponse> {
        this.initData(viewValidationParams);
        return this.validateView();
    }

    protected initData(viewValidationParams: ViewValidationParams): void {
        this._formValidator = this.container.get(ViewFormValidator, null);
        this._dataValidator = this.container.get(ViewDataValidator, null);
        this._serverRulesValidator = this.container.get(ViewServerRulesValidator, null);
        this._validationResponse = new ViewValidationResponse();
        this._viewValidationParams = viewValidationParams;
    }

    protected validateView(): Promise<ViewValidationResponse> {
        let isFormValid: boolean = true;
        if (this.needToValidateForm()) {
            isFormValid = this.validateForm();
        }
        if (!isFormValid) {
            return new Promise<ViewValidationResponse>((accept, reject) => { accept(this._validationResponse) }); 
        } else {
            return this.validateDataAndRules();
        }
    }

    protected needToValidateForm(): boolean {
        return this._viewValidationParams.needToValidateForm;
    }

    protected validateForm(): boolean {
        let formValidationResponse: ViewValidationResponse = this._formValidator.validate(this._viewValidationParams.formId);
        this._validationResponse.hasError = formValidationResponse.hasError;
        if (formValidationResponse.hasError) {
            this._validationResponse.errorMessages = formValidationResponse.errorMessages;
        }

        return !formValidationResponse.hasError;
    }

    protected validateDataAndRules(): Promise<ViewValidationResponse> {
        let isDataValid: boolean = true;
        if (this.needToValidateData()) {
            isDataValid = this.validateData();
        }
        if (!isDataValid) {
            return new Promise<ViewValidationResponse>((accept, reject) => { accept(this._validationResponse) }); 
        } else {
            return this.validateRules();
        }
    }
    protected needToValidateData(): boolean {
        return this._dataValidator != null;
    }

    protected validateData(): boolean {
        let dataValidationResponse: ViewValidationResponse = this._dataValidator.validate(this._viewValidationParams.viewModel);
        this._validationResponse.hasError = dataValidationResponse.hasError;
        if (dataValidationResponse.hasError) {
            this._validationResponse.errorMessages = dataValidationResponse.errorMessages;
        }

        return !dataValidationResponse.hasError;
    }

    protected validateRules(): Promise<ViewValidationResponse> {
        if (this.needToValidateRules()) {
            return this.doRulesValidation();
        } else {
            this._validationResponse.hasError = false;
            return new Promise<ViewValidationResponse>((accept, reject) => { accept(this._validationResponse) }); 
        }
    }

    protected needToValidateRules(): boolean {
        return this._serverRulesValidator != null;
    }

    protected doRulesValidation(): Promise<ViewValidationResponse> {
        return this._serverRulesValidator.validate(this._viewValidationParams.viewId, this._viewValidationParams, this._viewValidationParams.validationData)
            .then(validationResponse => {
                this._validationResponse.hasError = validationResponse.data.hasError;
                if (validationResponse.data.hasError) {
                    this._validationResponse.errorMessages = validationResponse.data.errorMessage;
                }
                return this._validationResponse;
            });
    }

	public destroy(): void {	
        if (this._formValidator) {
            this._formValidator.destroy();
        }
	}
}

export interface IViewValidator {
    validate(viewValidationParams: ViewValidationParams): Promise<ViewValidationResponse>;
	destroy(): void;
}
