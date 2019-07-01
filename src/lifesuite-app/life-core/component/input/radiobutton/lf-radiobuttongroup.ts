import {
    Component,
    forwardRef,
    Input,
    ContentChildren,
    QueryList,
    ElementRef,
    AfterContentInit,
    AfterViewInit,
    Output,
    EventEmitter,
    ChangeDetectionStrategy,
    ChangeDetectorRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { LfInputComponent } from '../shared/lf-input.component';
import { LfRadioButton } from './lf-radiobutton';
import { SecureComponent } from '../../authorization';

const RADIO_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => LfRadioButtonGroup),
    multi: true
};

let nextId = 0;

/**
 * Easily create Bootstrap-style radio button group. A value of a selected button is bound to a variable
 * specified via ngModel.
 */
@Component({
    selector: 'lf-radiobuttongroup',
    template: `<div class="radio-group"><ng-content></ng-content></div>`,
    inputs: ['disabled', 'hidden', 'required', 'readonly', 'authorizationLevel'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [RADIO_VALUE_ACCESSOR, { provide: SecureComponent, useExisting: forwardRef(() => LfRadioButtonGroup) }]
})
export class LfRadioButtonGroup extends LfInputComponent<any>
    implements ControlValueAccessor, AfterContentInit, AfterViewInit {
    @ContentChildren(LfRadioButton)
    private _radios: QueryList<LfRadioButton>;

    /**
     * The name of the group. Unless enclosed inputs specify a name, this name is used as the name of the
     * enclosed inputs. If not specified, a name is generated automatically.
     */
    @Input()
    public name: string = `lf-radiobuttongroup-${nextId++}`;

    public onChange = (_: any) => {};
    public onTouched = () => {};
    @Output()
    public change: EventEmitter<any> = new EventEmitter();

    constructor(elementRef: ElementRef<HTMLElement>, cdr: ChangeDetectorRef) {
        super(elementRef, cdr);
    }

    public ngAfterViewInit(): void {
        if (this.hasRadioButtons()) {
            this.inputElement = this._radios.first.inputElement;
        }
    }

    public ngAfterContentInit(): void {
        if (this.hasRadioButtons()) {
            setTimeout(() => {
                this.setRadioGroup();
            }, 0);
        }
    }

    public hasRadioButtons(): boolean {
        return this._radios && this._radios.length > 0;
    }

    protected setRadioGroup(): void {
        this._radios.forEach(radio => {
            radio.group = this;
        });
    }

    public onRadioValueUpdate(value: any): void {
        if (this.valueChanged(value)) {
            this.change.emit(value);
            this.writeValue(value);
            this.onChange(value);
        }
    }

    protected valueChanged(value: any): boolean {
        return value != this.value;
    }

    // public register(radio: LfRadioButton): void {
    //     this._radios.push(radio);
    // }

    public registerOnChange(fn: (value: any) => any): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: () => any): void {
        this.onTouched = fn;
    }

    // public unregister(radio: LfRadioButton): void {
    //     if (this.hasRadioButtons()) {
    //         this._radios.splice(this._radios.indexOf(radio), 1);
    //     }
    // }

    public writeValue(value: any): void {
        this.value = value;
        this.updateRadiosValue();
    }

    private updateRadiosValue(): void {
        if (this.hasRadioButtons()) {
            this._radios.forEach(radio => radio.updateValue(this.value));
        }
    }

    public onDisabledChange(): void {
        if (this._radios) {
            this._radios.forEach(radio => {
                radio.disabled = this.disabled;
            });
        }
        super.onDisabledChange();
    }

    public onHiddenChange(): void {
        if (this._radios) {
            this._radios.forEach(radio => {
                radio.hidden = this.hidden;
            });
        }
        super.onHiddenChange();
    }
}
