import {
    Component,
    Input,
    ElementRef,
    ContentChild,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    OnDestroy,
    Renderer2
} from '@angular/core';
import { NgModel } from '@angular/forms';

import { FormInputAccessor } from 'life-core/component/input';
import { SubscriptionTracker } from 'life-core/event/subscription-tracker';
import { FormErrors } from './form-types';

export type LabelPosition = 'top' | 'left' | 'right' | 'bottom';

@Component({
    selector: 'lf-form-input',
    templateUrl: './form-input.html',
    styleUrls: ['./form-input.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

/**
 * Wrapper component for Inputs inside form.
 * Displays input component's label, validation message,
 * and other indicators, such as required field mark.
 */
export class FormInput implements OnDestroy {
    private _controls: Array<FormInputAccessor> = [];

    @Input()
    public label: string;

    @Input()
    public labelPosition: LabelPosition = 'top';

    @Input('labelClass')
    public customLabelClass: string;

    @ContentChild(NgModel)
    public ngModel: NgModel;

    public readonly elementRef: ElementRef<HTMLElement>;

    public labelFor: string;

    public wrapperClass: string;

    public labelClass: string;

    public contentClass: string;

    public showRequiredMark: boolean;

    public showError: boolean = false;

    public errorMessage: string | undefined;

    private _hidden: boolean;

    private _disabled: boolean;

    private _formErrors: FormErrors;

    private _cd: ChangeDetectorRef;

    private _renderer: Renderer2;

    private _subscriptionTracker: SubscriptionTracker;

    constructor(elementRef: ElementRef<HTMLElement>, cd: ChangeDetectorRef, renderer: Renderer2) {
        this.elementRef = elementRef;
        this._cd = cd;
        this._renderer = renderer;
        this._subscriptionTracker = new SubscriptionTracker();
    }

    private init(): void {
        this.validateProps();
        this.setLabelFor();
        this.setStyleClasses();
        this.subscribeToControlEvents();
        this.updateHidden();
        this.updateDisabled();
        this.updateRequired();
    }

    private validateProps(): void {
        if (this.controls.length == 0) {
            throw new Error("Undefined property: 'control'.");
        }
    }

    @Input()
    public set controls(ctrls: Array<FormInputAccessor>) {
        this._controls = ctrls;
        this.init();
    }

    public get controls(): Array<FormInputAccessor> {
        return this._controls;
    }

    @Input()
    public set control(ctrl: FormInputAccessor) {
        this.controls = [ctrl];
    }

    public get control(): FormInputAccessor {
        return this.controls[0];
    }

    private get controlName(): string {
        return this.control.name || this.controlNativeElement.getAttribute('name');
    }

    private setLabelFor(): void {
        this.labelFor = this.controlName;
    }

    @Input()
    public set hidden(value: boolean) {
        this.updateHidden(value);
    }

    public get hidden(): boolean {
        return this._hidden;
    }

    public get formErrors(): FormErrors {
        return this._formErrors;
    }

    public set formErrors(formErrors: FormErrors) {
        this._formErrors = formErrors;
        this.setShowError();
    }

    public showFocusedError(): void {
        const focusedErrorClass = 'invalid-glow';
        this._renderer.addClass(this.controlNativeElement, focusedErrorClass);
        setTimeout(() => {
            this._renderer.removeClass(this.controlNativeElement, focusedErrorClass);
        }, 2000);
        // TODO: Investigate why 'transitionend' event is not fired
        // const unlisten = this._renderer.listen(this.controlNativeElement, 'transitionend', event => {
        //     this._renderer.removeClass(this.controlNativeElement, focusedErrorClass);
        //     unlisten();
        // });
    }

    private setShowError(): void {
        const showError = this.needToShowError();
        if (showError) {
            this.setErrorMessage();
        }
        if (this.showError != showError) {
            this.showError = showError;
            this.controlNativeElement.classList.toggle('ui-reveal');
            this._cd.markForCheck();
        }
    }

    private needToShowError(): boolean {
        return this.formErrors && !!this.formErrors[this.controlName];
    }

    private setErrorMessage(): void {
        const newMessage = this.formErrors ? this.formErrors[this.controlName] : undefined;
        if (this.errorMessage != newMessage) {
            this.errorMessage = newMessage;
            this._cd.markForCheck();
        }
    }

    private setStyleClasses(): void {
        this.setWrapperClass();
        this.setLabelClass();
        this.setContentClass();
    }

    private setWrapperClass(): void {
        this.wrapperClass = this.getWrapperClass();
    }

    private getWrapperClass(): string {
        return `${this.getInputClass()} ${this.labelPosition == 'left' ? 'row' : ''}`;
    }

    private setLabelClass(): void {
        this.labelClass = this.getLabelClass();
    }

    private getLabelClass(): string {
        return `${this.customLabelClass ? this.customLabelClass : ''} ${
            this._disabled == true ? 'lf-form-input-label-disabled' : ''
        }`;
        // return `${this.customLabelClass} ${this.isInputCheckbox()? 'form-check-label' : (this.labelPosition == 'left')? 'col-form-label' : ''}`;
    }

    private setContentClass(): void {
        this.contentClass = this.getContentClass();
    }

    private getContentClass(): string {
        return `lf-form-input-content ${
            this.labelPosition == 'top' ? 'bottom' : this.labelPosition == 'right' ? 'left' : 'right'
        }`;
    }

    private getInputClass(): string {
        return 'form-group';
        // return this.isInputCheckbox() ? 'form-check' : 'form-group';
    }

    private get controlNativeElement(): HTMLElement {
        return this.control.elementRef.nativeElement;
    }

    private subscribeToControlEvents(): void {
        this.controls.forEach(control => {
            if (this.control.hiddenChange) {
                this._subscriptionTracker.track(
                    this.control.hiddenChange.subscribe(value => {
                        this.updateHidden(value);
                    })
                );
            }
            if (this.control.disabledChange) {
                this._subscriptionTracker.track(
                    this.control.disabledChange.subscribe(value => {
                        this.updateDisabled(value);
                    })
                );
            }
        });
        if (this.control.requiredChange) {
            this._subscriptionTracker.track(
                this.control.requiredChange.subscribe(value => {
                    this.updateRequired();
                })
            );
        }
    }

    protected updateHidden(value?: boolean): void {
        if (value == undefined) {
            value = this._hidden;
        }
        this._hidden = this.controls.every(control => {
            return control.hidden;
        })
            ? true
            : value;
    }

    protected updateDisabled(value?: boolean): void {
        this._disabled = value !== undefined ? value : this.control.disabled;
        this.setLabelClass();
        this._cd.markForCheck();
    }

    protected updateRequired(): void {
        this.setShowRequiredMark();
    }

    private setShowRequiredMark(): void {
        this.showRequiredMark = !!this.control.required;
        this._cd.markForCheck();
    }

    public get ngModelStandalone(): boolean {
        return this.ngModel && this.ngModel.options ? this.ngModel.options.standalone : false;
    }

    public ngOnDestroy(): void {
        this._subscriptionTracker.destroy();
        this._cd = null;
    }
}
