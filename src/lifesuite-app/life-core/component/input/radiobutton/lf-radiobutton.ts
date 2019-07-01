import {
    Component,
    forwardRef,
    ElementRef,
    Input,
    OnDestroy,
    ViewChild,
    ChangeDetectorRef,
    ChangeDetectionStrategy
} from '@angular/core';

import { LfInputComponent } from '../shared/lf-input.component';
import { FormInputAccessor } from '../shared/form-input.accessor';
import { ISecureComponent, SecureComponent } from '../../authorization';
import { LfRadioButtonGroup } from './lf-radiobuttongroup';

@Component({
    selector: 'lf-radiobutton',
    templateUrl: './lf-radiobutton.html',
    styleUrls: ['./lf-radiobutton.css'],
    inputs: ['disabled', 'hidden', 'readonly'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{ provide: SecureComponent, useExisting: forwardRef(() => LfRadioButton) }]
})
export class LfRadioButton extends LfInputComponent<any> implements FormInputAccessor, ISecureComponent, OnDestroy {
    @Input()
    public value: any;

    @Input()
    public label: string;

    @Input()
    public tabindex: number;

    @Input()
    public inputId: string;

    @Input()
    public styleClass: string;

    @Input()
    public labelStyleClass: string;

    public checked: boolean;

    @ViewChild('input')
    public inputElement: ElementRef<HTMLInputElement>;

    private _group: LfRadioButtonGroup;

    // constructor(@Host() group: LfRadioButtonGroup, elementRef: ElementRef) {
    //     super(elementRef);
    //     this._group = group;
    //     if (group) this._group.register(this);
    // }
    constructor(elementRef: ElementRef<HTMLElement>, cdr: ChangeDetectorRef) {
        super(elementRef, cdr);
    }

    public get group(): LfRadioButtonGroup {
        return this._group;
    }

    public set group(value: LfRadioButtonGroup) {
        this._group = value;
    }

    public handleClick(event: Event): void {
        event.preventDefault();

        if (this.disabled) {
            return;
        }

        this._group.onRadioValueUpdate(this.value);
    }

    public updateValue(value: any): void {
        setTimeout(() => {
            this.checked = value == this.value || String(value).toString() == String(this.value).toString();

            if (this.inputElement) {
                this.inputElement.nativeElement.checked = this.checked;
                this.cdr.markForCheck();
            }
        }, 0);
    }

    public onChange(event: Event): void {
        event.stopPropagation();
        this._group.onRadioValueUpdate(this.value);
    }

    public onLabelClick(): void {
        // this._group.onRadioValueUpdate(this.value);
    }

    public onFocus(event: Event): void {
        if (this.disabled) {
            return;
        }
        this.focused = true;
    }

    public onBlur(event: Event): void {
        this.focused = false;
    }

    public setFocus(): void {
        if (!this.focused) {
            this.inputElement.nativeElement.focus();
        }
    }

    // Declare '_disabled' to satisfy compiler.
    // The actual '_disabled' property is declared in mixinInputDisabled
    private _disabled: boolean;
    public get disabled(): boolean {
        return this._group ? this._group.disabled || this._disabled : this._disabled;
    }

    // Override implementation in mixinInputDisabled
    public set disabled(isDisabled: boolean) {
        if (this._disabled !== isDisabled) {
            this._disabled = isDisabled;
            this.cdr.markForCheck();
        }
    }

    // Declare '_hidden' to satisfy compiler.
    // The actual '_hidden' property is declared in mixinHiddenDisabled
    private _hidden: boolean;
    public get hidden(): boolean {
        return this._group ? this._group.hidden || this._hidden : this._hidden;
    }

    public set hidden(value: boolean) {
        this.updateHidden(value);
    }

    public ngOnDestroy(): void {
        // this._group.unregister(this);
    }

    public onKeyDown(event: Event): void {
        if (this.disabled) {
            return;
        }
    }
}
