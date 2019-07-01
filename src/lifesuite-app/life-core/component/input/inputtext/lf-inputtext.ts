import {
    Component,
    Input,
    Output,
    Provider,
    ElementRef,
    EventEmitter,
    forwardRef,
    ViewChild,
    ChangeDetectionStrategy,
    ChangeDetectorRef
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { LfInputComponent, INPUT_HOST } from '../shared';
import { SecureComponent } from '../../authorization';
import { Keys } from 'life-core/util/keyboard';

export const INPUTTEXT_VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => LfInputText),
    multi: true
};

@Component({
    selector: 'lf-inputtext',
    templateUrl: './lf-inputtext.html',
    inputs: ['disabled', 'hidden', 'required', 'readonly', 'authorizationLevel'],
    host: INPUT_HOST,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [INPUTTEXT_VALUE_ACCESSOR, { provide: SecureComponent, useExisting: forwardRef(() => LfInputText) }]
})
export class LfInputText extends LfInputComponent<any> implements ControlValueAccessor {
    @Input()
    public style: any;

    @Input()
    public maxLength: number;

    @Input()
    public placeholder: string;

    @Input()
    public regExp: RegExp;

    @Input()
    public spellcheck: boolean = false;

    @Output()
    public blur: EventEmitter<any> = new EventEmitter<any>();

    protected onModelChange: Function = () => {};

    protected onModelTouched: Function = () => {};

    @ViewChild('textInput')
    protected inputElement: ElementRef<HTMLInputElement>;

    constructor(elementRef: ElementRef<HTMLElement>, cdr: ChangeDetectorRef) {
        super(elementRef, cdr);
    }

    public writeValue(value: any): void {
        this.updateValue(value);
        this.updateNativeValue(this.value ? this.value : '');
    }

    public registerOnChange(fn: Function): void {
        this.onModelChange = fn;
    }

    public registerOnTouched(fn: Function): void {
        this.onModelTouched = fn;
    }

    public setDisabledState(value: boolean): void {
        this.updateDisabled(value);
    }

    public onFocus(event: Event): void {
        if (this.readonly) {
            return;
        }
        this.focused = true;
    }

    public onBlur(event: any): void {
        this.focused = false;
        this.updateValue(event.target.value);
        this.updateModel();
        this.onModelTouched();
        this.blur.emit(event);
    }

    public onKeyDown(event: Event): void {
        if (this.readonly) {
            return;
        }
    }

    public onKeyPress(event: KeyboardEvent): void {
        if (this.readonly) {
            return;
        }
        const actualLength = this.inputElement.nativeElement.value.length;
        if (this.maxLength && actualLength >= this.maxLength) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        if (event.keyCode == Keys.enter) {
            this.onEnterPress(event);
        }
        if (!this.isValidCharCode(event.charCode)) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }
    }

    public onEnterPress(event: any): void {
        if (this.readonly) {
            return;
        }
        this.updateValue(event.target.value);
        this.updateModel();
    }

    protected isValidCharCode(charCode: number): boolean {
        if (this.regExp) {
            const char = String.fromCharCode(charCode);
            return this.regExp.test(char);
        }
        return true;
    }

    protected updateValue(value: any): void {
        this.value = value;
    }

    protected updateNativeValue(value: any): void {
        if (this.inputElement.nativeElement) {
            this.inputElement.nativeElement.value = value;
        }
    }

    public updateModel(): void {
        this.onModelChange(this.value);
    }

    protected triggerValidation(): void {
        setTimeout(() => {
            this.onModelChange(this.value);
        });
    }

    public handleInputChange(event: Event): void {
        if (this.readonly) {
            return;
        }
    }
}
