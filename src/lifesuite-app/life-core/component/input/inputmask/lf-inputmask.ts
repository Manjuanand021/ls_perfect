import {
    Component,
    forwardRef,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    Provider,
    ViewChild,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    OnDestroy
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputMask } from 'primeng/inputmask';
import { DomHandler } from 'primeng/components/dom/domhandler';

import { AuthorizationLevel } from 'life-core/authorization';

import { FormInputAccessor, INPUT_HOST } from '../shared';
import { ISecureComponent, SecureComponent, AuthorizationUtil } from '../../authorization';

export const INPUTMASK_VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => LfInputMask),
    multi: true
};

export const INPUTMASK_PROVIDERS: Array<Provider> = [DomHandler];

@Component({
    selector: 'lf-inputmask',
    templateUrl: './lf-inputmask.html',
    host: INPUT_HOST,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        INPUTMASK_VALUE_ACCESSOR,
        ...INPUTMASK_PROVIDERS,
        { provide: SecureComponent, useExisting: forwardRef(() => LfInputMask) }
    ]
})
export class LfInputMask extends InputMask implements FormInputAccessor, ISecureComponent {
    @ViewChild('input')
    protected inputElement: ElementRef<HTMLInputElement>;

    @Output()
    public requiredChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    @Output()
    public disabledChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    @Output()
    public hiddenChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    private _required: boolean;

    private _disabled: boolean;

    private _hidden: boolean;

    private _authorizationLevel: AuthorizationLevel;

    private _cdr: ChangeDetectorRef;

    constructor(el: ElementRef, cdr: ChangeDetectorRef, domHandler: DomHandler) {
        super(el, domHandler);
        this._cdr = cdr;
    }

    public get elementRef(): any {
        return this.el;
    }

    public setFocus(): void {
        this.inputElement.nativeElement.focus();
    }

    @Input()
    public set required(value: boolean) {
        this.updateRequired(value);
    }

    public get required(): boolean {
        return this._required;
    }

    @Input()
    public set disabled(value: boolean) {
        this.updateDisabled(value);
    }

    public get disabled(): boolean {
        return this._disabled;
    }

    @Input()
    public set hidden(value: boolean) {
        this.updateHidden(value);
    }

    public get hidden(): boolean {
        return this._hidden;
    }

    // Component Authorization
    @Input()
    public set authorizationLevel(value: AuthorizationLevel) {
        this._authorizationLevel = value;
        this.updateDisabled(this.disabled);
        this.updateHidden(this._hidden);
    }

    public get authorizationLevel(): AuthorizationLevel {
        return this._authorizationLevel;
    }

    protected updateDisabled(value: boolean): void {
        const disabledByAuthorization = AuthorizationUtil.isInputComponentDisabled(this._authorizationLevel);
        const newValue = this.readonly ? true : disabledByAuthorization ? true : value;
        if (this._disabled != newValue) {
            this._disabled = newValue;
            this.disabledChange.emit(newValue);
            this._cdr.markForCheck();
        }
    }

    protected updateHidden(value: boolean): void {
        const newValue = AuthorizationUtil.isInputComponentHidden(this._authorizationLevel) ? true : value;
        if (this._hidden != newValue) {
            this._hidden = newValue;
            this.hiddenChange.emit(newValue);
            this._cdr.markForCheck();
        }
    }

    protected updateRequired(value: any): void {
        const newValue = value === '' ? true : value;
        if (this._required != newValue) {
            this._required = newValue;
            this.requiredChange.emit(newValue);
            this._cdr.markForCheck();
        }
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
        this._cdr = null;
    }
}
