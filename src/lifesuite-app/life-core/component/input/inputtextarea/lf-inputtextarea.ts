import { Component, Input, Provider, forwardRef, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { DomHandler } from 'primeng/components/dom/domhandler';

import { LfInputComponent, INPUT_HOST } from '../shared';
import { SecureComponent } from '../../authorization';
import { IStatefulComponent, StatefulComponent, ComponentState } from 'life-core/component/shared';
// import { Keys } from 'life-core/util';

export const INPUTTEXTAREA_VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => LfInputTextarea),
    multi: true
};

export const INPUTTEXTAREA_PROVIDERS: Array<Provider> = [DomHandler];

@Component({
    selector: 'lf-inputtextarea',
    templateUrl: './lf-inputtextarea.html',
    inputs: ['disabled', 'hidden', 'required', 'readonly', 'authorizationLevel'],
    host: INPUT_HOST,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        INPUTTEXTAREA_VALUE_ACCESSOR,
        ...INPUTTEXTAREA_PROVIDERS,
        { provide: SecureComponent, useExisting: forwardRef(() => LfInputTextarea) },
        { provide: StatefulComponent, useExisting: forwardRef(() => LfInputTextarea) }
    ]
})
export class LfInputTextarea extends LfInputComponent<any> implements OnInit, ControlValueAccessor, IStatefulComponent {
    @Input()
    public autoResize: boolean;

    @Input()
    public rows: number;

    @Input()
    public cols: number;

    @Input()
    public maxLength: number;

    @Input()
    public style: any;

    @Input()
    public class: any;

    public rowsDefault: number;

    public colsDefault: number;

    protected onModelChange: Function = () => {};

    protected onModelTouched: Function = () => {};

    @ViewChild('textareaInput')
    protected inputElement: ElementRef<HTMLTextAreaElement>;

    private _stateId: string;

    constructor(elementRef: ElementRef<HTMLElement>, cdr: ChangeDetectorRef) {
        super(elementRef, cdr);
    }

    public ngOnInit(): void {
        this.rowsDefault = this.rows;
        this.colsDefault = this.cols;
    }

    public writeValue(value: any): void {
        this.value = value;
        if (this.inputElement.nativeElement) {
            this.inputElement.nativeElement.value = this.value ? this.value : '';
            this.inputElement.nativeElement.title = this.value ? this.value : '';
        }
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
        if (this.autoResize) {
            this.resize();
        }
    }

    public onBlur(event: any): void {
        this.focused = false;
        if (this.autoResize) {
            this.resize();
        }
        this.onModelTouched();
        this.updateValue(event.target.value);
        this.updateModel(event);
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
        if (this.maxLength && this.value && this.value.length > this.maxLength) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }

        this.updateModel(event);
    }

    public onKeyup(event: Event): void {
        if (this.autoResize) {
            this.resize();
        }
    }

    protected updateValue(value: any): void {
        this.value = value;
    }

    public updateModel(event: any): void {
        this.onModelChange(event.target.value);
    }

    public handleInputChange(event: any): void {
        if (this.readonly) {
            return;
        }
        this.updateValue(event.target.value);
        this.updateModel(event);
    }

    public resize(): void {
        let linesCount = 0;
        const lines = this.value.split('\n');

        for (let i = lines.length - 1; i >= 0; --i) {
            linesCount += Math.floor(lines[i].length / this.colsDefault + 1);
        }

        this.rows = linesCount >= this.rowsDefault ? linesCount + 1 : this.rowsDefault;
    }

    private get inputTextAreaElement(): HTMLTextAreaElement {
        return this.inputElement.nativeElement;
    }

    // State management

    public get stateId(): string {
        return this._stateId;
    }

    @Input()
    public set stateId(id: string) {
        this._stateId = id;
        this.setNameAttribute(this._stateId);
    }

    private setNameAttribute(name: string): void {
        if (!this.inputTextAreaElement.getAttribute('name')) {
            this.inputTextAreaElement.setAttribute('name', name);
        }
    }

    public get state(): ComponentState {
        const componentState = new Map<string, any>();
        const textAreaSize = new TextAreaSize(
            this.inputTextAreaElement.style.height,
            this.inputTextAreaElement.style.width
        );
        componentState.set('textAreaSize', textAreaSize);
        return componentState;
    }

    @Input()
    public set state(componentState: ComponentState) {
        if (componentState) {
            const savedTextAreaSize = componentState.get('textAreaSize') as TextAreaSize;
            this.setTextAreaSize(savedTextAreaSize);
        }
    }

    private setTextAreaSize(size: TextAreaSize): void {
        this.inputTextAreaElement.style.height = size.height;
        this.inputTextAreaElement.style.width = size.width;
    }
}

class TextAreaSize {
    public height: string;
    public width: string;

    constructor(height: string, width: string) {
        this.height = height;
        this.width = width;
    }
}
