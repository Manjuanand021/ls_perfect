import { Input, Output, ElementRef, EventEmitter, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Validator, ValidationResult } from './validators';
import { ValidatorUtil } from './validator.util';
import { FormInputAccessor } from './form-input.accessor';
import { SecureComponent, AuthorizationUtil } from '../../authorization';

import { CanAuthorize, CanAuthorizeCtor, mixinInputAuthorized } from './behaviors';
import { CanDisable, CanDisableCtor, mixinInputDisabled } from './behaviors/';
import { CanHide, CanHideCtor, mixinInputHidden } from './behaviors';
import { CanRequire, CanRequireCtor, mixinInputRequired } from './behaviors';
import { CanReadonly, CanReadonlyCtor, mixinInputReadonly } from './behaviors';

class _LfInputComponentBase extends SecureComponent {}

const _LfInputComponentMixinBase: CanAuthorizeCtor &
    CanRequireCtor &
    CanHideCtor &
    CanDisableCtor &
    CanReadonlyCtor &
    typeof _LfInputComponentBase = mixinInputAuthorized(
    mixinInputRequired(mixinInputHidden(mixinInputDisabled(mixinInputReadonly(_LfInputComponentBase))))
);

/**
 *  Base class for input components.
 */
export abstract class LfInputComponent<T> extends _LfInputComponentMixinBase
    implements FormInputAccessor, CanAuthorize, CanDisable, CanHide, CanRequire, CanReadonly, OnDestroy {
    @Input()
    public name: string;

    public value: T;

    @Input()
    public style: any;

    @Input()
    public placeholder: string;

    @Output()
    public requiredChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    @Output()
    public hiddenChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    @Output()
    public disabledChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * user defined validators.
     */
    @Input()
    public validators: Array<Validator>;

    public readonly elementRef: any;

    public focused: boolean = false;

    protected inputElement: ElementRef<HTMLElement>;

    protected cdr: ChangeDetectorRef;

    constructor(elementRef: ElementRef<HTMLElement>, cdr: ChangeDetectorRef) {
        super();
        this.elementRef = elementRef;
        this.cdr = cdr;
    }

    public setFocus(): void {
        if (!this.readonly) {
            if (!this.focused) {
                this.inputElement.nativeElement.focus();
            }
        }
    }

    @Input()
    public set autocomplete(value: boolean) {
        this.setAutocompleteValue(this.inputElement.nativeElement as HTMLInputElement, value);
    }

    protected setAutocompleteValue(element: HTMLInputElement, value: boolean): void {
        element.autocomplete = value ? 'on' : 'some_random_value';
        // TODO: For inputs with type='password' in Chrome, setting 'autocomplete=off' doesn't remove prompt;
        // Need to find out how to disable it; some suggested appraches -
        // set 'autocomplete=new-password' or 'autocomplete=false' - still don't work:
        // nativeElement.autocomplete = (nativeElement.type == 'password') ? 'false' : 'off';
        // https://developer.mozilla.org/en-US/docs/Web/Security/Securing_your_site/Turning_off_form_autocompletion
    }

    // Component Authorization
    public onAuthorizationLevelChange(): void {
        this.updateDisabled(this.disabled);
        this.updateHidden(this.hidden);
    }

    public get isDisabledByAuthorization(): boolean {
        return AuthorizationUtil.isInputComponentDisabled(this.authorizationLevel);
    }

    public onDisabledChange(): void {
        this.disabledChange.emit(this.disabled);
        this.cdr.markForCheck();
    }

    public get isHiddenByAuthorization(): boolean {
        return AuthorizationUtil.isInputComponentHidden(this.authorizationLevel);
    }

    public onHiddenChange(): void {
        this.hiddenChange.emit(this.hidden);
        this.cdr.markForCheck();
    }

    public onRequiredChange(): void {
        this.requiredChange.emit(this.required);
        this.cdr.markForCheck();
    }

    public ngOnDestroy(): void {
        this.cdr = null;
    }

    protected executeCustomValidators(c: FormControl, value?: any): ValidationResult {
        return ValidatorUtil.executeValidators(this.validators, c, value);
    }
}
