import { Injector } from '@angular/core';
import { NgForm, Validators } from '@angular/forms';

import { IViewModel, ParentChildRegistry } from 'life-core/view-model';
import { FormErrors, FormInput } from 'life-core/component/form';
import { IMessagingService, MessagingService } from 'life-core/messaging';
import { ViewModelUtil } from '../view-model.util';
import { IViewFormValidator, ViewFormValidator } from './form/view-form.validator';
import { ViewValidationParams, ViewValidationResponse } from './view-validation.model';
import { ViewValidationChannels } from './view-validation-channels';
import { FormResetScheduler } from './form/reset/form-reset-scheduler';
import { SubscriptionTracker } from 'life-core/event/subscription-tracker';

export interface IViewValidator {
    validate(viewValidationParams: ViewValidationParams): Promise<ViewValidationResponse>;
    renderValidationMessages(): void;
    viewFormValidator: IViewFormValidator;
    onFormInputsChange(): void;
    scheduleFormReset(): void;
    destroy(): void;
}

export class ViewValidator implements IViewValidator {
    protected injector: Injector;

    protected viewModel: IViewModel;

    protected parentChildRegistry: ParentChildRegistry;

    protected formValidator: IViewFormValidator;

    protected viewValidationParams: ViewValidationParams;

    private _messagingService: IMessagingService;

    private _formResetScheduler: FormResetScheduler;

    private _subscriptionTracker: SubscriptionTracker;

    constructor({
        injector,
        viewModel,
        parentChildRegistry
    }: {
        injector: Injector;
        viewModel: IViewModel;
        parentChildRegistry: ParentChildRegistry;
    }) {
        this.injector = injector;
        this.viewModel = viewModel;
        this.parentChildRegistry = parentChildRegistry;
        this._messagingService = injector.get(MessagingService);
        this._subscriptionTracker = new SubscriptionTracker();
        this.setup();
    }

    public validate(viewValidationParams: ViewValidationParams): Promise<ViewValidationResponse> {
        return this.validateView();
    }

    public get viewFormValidator(): IViewFormValidator {
        return this.formValidator;
    }

    public scheduleFormReset(): void {
        this._formResetScheduler.scheduleReset(this.viewModel);
    }

    protected setup(): void {
        this.setupFormValidator();
        this._formResetScheduler = this.injector.get(FormResetScheduler);
        // this._dataValidator = this.injector.get(ViewDataValidator, null);
        // this._serverRulesValidator = this.injector.get(ViewServerRulesValidator, null);
    }

    private setupFormValidator(): void {
        this.createFormValidator();
        this.onFormChanged();
    }

    private createFormValidator(): void {
        if (this.needToCreateFormValidator()) {
            this.formValidator = new ViewFormValidator(this.injector);
        }
    }

    private needToCreateFormValidator(): boolean {
        return this.viewModel.isRoot && this.viewModel.hasForm;
    }

    protected onFormChanged(): void {
        if (this.viewModel.hasForm) {
            if (this.viewModel.isRoot) {
                this._subscriptionTracker.track(
                    this.viewFormValidator.eventEmitterFormErrors.subscribe(formErrors =>
                        this.onFormErrorsChanged(formErrors)
                    )
                );
                this.onRootFormChanged();
            } else {
                this.onChildFormChanged();
            }
        }
    }

    private onRootFormChanged(): void {
        this.viewFormValidator.formChanged(this.viewModel.form);
    }

    private onChildFormChanged(): void {
        if (this.viewModel.isChild) {
            setTimeout(() => this.updateFormWithFormInputs(this.viewModel), 0);
        }
    }

    public onFormInputsChange(): void {
        this.updateFormWithFormInputs(this.viewModel);
    }

    private onFormErrorsChanged(formErrors: FormErrors): void {
        this.updateFormErrors(formErrors);
        this.publishFormErrorsChanged(formErrors);
    }

    private updateFormErrors(formErrors: FormErrors): void {
        this.viewModel.formErrors = formErrors;
        for (const child of this.parentChildRegistry.children) {
            child.formErrors = formErrors;
        }
    }

    private publishFormErrorsChanged(formErrors: FormErrors): void {
        if (!ViewModelUtil.isDialogViewModel(this.viewModel)) {
            this._messagingService.publish(
                ViewValidationChannels.FormValidationMessagesChange,
                this.formValidator.getFormErrorsAsArray(this.parentChildRegistry.combinedFormInputs)
            );
        }
    }

    private updateFormWithFormInputs(viewModel: IViewModel): void {
        const ngForm = viewModel.getRootForm();
        const formInputs = viewModel.getFormInputs();
        formInputs.forEach(formInput => {
            if (formInput.ngModel && !formInput.ngModelStandalone) {
                ngForm.addControl(formInput.ngModel);
                this.handleFormInputRequiredChange(formInput, ngForm);
                // console.debug(`Form control added: ${formInput.ngModel.name}`, formInput.ngModel);
            }
        });
    }

    private handleFormInputRequiredChange(formInput: FormInput, ngForm: NgForm): void {
        if (formInput.control.requiredChange) {
            this._subscriptionTracker.track(
                formInput.control.requiredChange.subscribe(isRequired => {
                    const ngFormControl = ngForm.controls[formInput.control.name];
                    const validators = isRequired ? [Validators.required] : [];
                    if (formInput.ngModel.validator) {
                        validators.push(formInput.ngModel.validator);
                    }
                    ngFormControl.setValidators(validators);
                    ngFormControl.updateValueAndValidity();
                })
            );
        }
    }

    protected validateView(): Promise<ViewValidationResponse> {
        const formValid = this.validateForm();
        return new Promise<ViewValidationResponse>((accept, reject) => {
            const response = new ViewValidationResponse();
            response.hasError = !formValid;
            response.formValidationMessages = this.formValidator.getFormErrorsAsArray(
                this.parentChildRegistry.combinedFormInputs
            );
            accept(response);
        });
    }

    protected validateForm(): boolean {
        if (this.formValidator) {
            this.formValidator.revealErrors();
            return this.formValidator.isFormValid();
        } else {
            return true;
        }
    }

    public renderValidationMessages(): void {
        this._messagingService.publish(ViewValidationChannels.RenderValidationMessages);
    }

    public destroy(): void {
        this.cleanupForm();
        this._subscriptionTracker.destroy();
        if (this.formValidator) {
            this.formValidator.destroy();
        }
    }

    private cleanupForm(): void {
        if (this._formResetScheduler.resetScheduledFromViewModel(this.viewModel)) {
            this.resetForm();
            this._formResetScheduler.unscheduleReset();
        }
        if (this.viewModel.hasForm && this.viewModel.isChild) {
            this.removeFormControls(this.viewModel);
        }
    }

    private resetForm(): void {
        const ngForm = this.viewModel.getRootForm();
        if (ngForm && ngForm.dirty) {
            ngForm.form.markAsPristine();
        }
    }

    private removeFormControls(viewModel: IViewModel): void {
        const ngForm = viewModel.getRootForm();
        const formInputs = viewModel.getFormInputs();
        formInputs.forEach(formInput => {
            if (formInput.ngModel && !formInput.ngModelStandalone) {
                ngForm.removeControl(formInput.ngModel);
            }
        });
    }
}
