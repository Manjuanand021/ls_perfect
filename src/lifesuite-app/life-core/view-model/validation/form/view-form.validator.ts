import { EventEmitter, Injector } from '@angular/core';
import { NgForm } from '@angular/forms';

import { SubscriptionTracker } from 'life-core/event/subscription-tracker';
import { CombinedFormInputs, FormInputUtil, FormErrors } from 'life-core/component/form';
import { ValidationMessagesBuilder } from './validation-messages.builder';

export interface IViewFormValidator {
    formErrors: FormErrors;
    getFormErrorsAsArray(formInputs: CombinedFormInputs): Array<FormValidationMessage>;
    eventEmitterFormErrors: EventEmitter<FormErrors>;
    formChanged(currentForm: NgForm): void;
    isFormValid(): boolean;
    revealErrors(): void;
    destroy(): void;
}

export class ViewFormValidator implements IViewFormValidator {
    protected injector: Injector;

    // Angular NgForm directive instance of the form.
    protected ngForm: NgForm;

    // Form validation errors
    public formErrors: FormErrors = {};

    public eventEmitterFormErrors: EventEmitter<FormErrors> = new EventEmitter<FormErrors>();

    protected validationMessagesBuilder: ValidationMessagesBuilder;

    private _subscriptionTracker: SubscriptionTracker;

    private _revealErrors: boolean;

    constructor(injector: Injector) {
        this.injector = injector;
        this.validationMessagesBuilder = injector.get(ValidationMessagesBuilder);
        this._subscriptionTracker = new SubscriptionTracker();
    }

    public isFormValid(): boolean {
        // Check '.invalid' instead of '.valid' property to correctly
        // detect form's state for edge cases.
        // For example, when form only has single disabled input,
        // its property '.valid' is set to 'false'.
        return !this.ngForm.form.invalid;
    }

    public formChanged(currentForm: NgForm): void {
        if (this.ngForm == currentForm) {
            return;
        }
        this.ngForm = currentForm;
        if (this.ngForm) {
            this._subscriptionTracker.track(
                this.ngForm.valueChanges.subscribe(data => {
                    this.onFormValueChanged(data);
                })
            );
        }
    }

    protected onFormValueChanged(formValues?: any): void {
        if (!this.ngForm) {
            return;
        }
        const formGroup = this.ngForm.form;
        // Create new object to trigger change detection
        const formErrors: FormErrors = this.cloneFormErrors(formValues);
        for (const controlId in formGroup.controls) {
            if (!this._revealErrors) {
                // clear previous error message (if any)
                formErrors[controlId] = '';
            }
            const control = formGroup.get(controlId);
            if (this._revealErrors || (control && control.dirty && !control.valid)) {
                formErrors[controlId] = this.validationMessagesBuilder.build(controlId, control.errors);
            }
        }
        this.formErrors = formErrors;
        this.eventEmitterFormErrors.emit(formErrors);
    }

    private cloneFormErrors(formValues: any): FormErrors {
        const result: FormErrors = {};
        Object.keys(this.formErrors).forEach(key => {
            if (this.formErrorKeyFound(key, formValues)) {
                result[key] = this.formErrors[key];
            }
        });
        return result;
    }

    private formErrorKeyFound(formErrorKey: string, formValues: any): boolean {
        return Object.keys(formValues).findIndex(formValueKey => formValueKey == formErrorKey) >= 0;
    }

    public revealErrors(): void {
        this._revealErrors = true;
        Object.keys(this.ngForm.controls).forEach(key => {
            const control = this.ngForm.controls[key];
            control.updateValueAndValidity({ emitEvent: true });
            // control.markAsTouched();
        });
        if (this.isFormValid()) {
            this._revealErrors = false;
        }
    }

    public getFormErrorsAsArray(combinedFormInputs: CombinedFormInputs): Array<FormValidationMessage> {
        const errorsArray: Array<FormValidationMessage> = [];
        Object.keys(this.formErrors).forEach(key => {
            if (this.formErrors[key].length > 0) {
                errorsArray.push(
                    new FormValidationMessage(
                        key,
                        combinedFormInputs ? this.getControlDescription(key, combinedFormInputs) : '',
                        this.formErrors[key]
                    )
                );
            }
        });
        return errorsArray;
    }

    private getControlDescription(controlName: string, combinedFormInputs: CombinedFormInputs): string {
        const formInput = FormInputUtil.getFormInputByControlName(controlName, combinedFormInputs);
        return formInput ? formInput.label : '';
    }

    public destroy(): void {
        this._subscriptionTracker.destroy();
    }
}

export class FormValidationMessage {
    public controlName: string;
    public controlDescription: string;
    public message: string;

    constructor(controlName: string, controlDescription: string, message: string) {
        this.controlName = controlName;
        this.controlDescription = controlDescription;
        this.message = message;
    }
}
