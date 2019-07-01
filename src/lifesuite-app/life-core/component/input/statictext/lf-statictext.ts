import {
    Component,
    Input,
    ElementRef,
    forwardRef,
    AfterContentInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef
} from '@angular/core';

import { PipeFormatHelper } from 'life-core/util/pipe';
import { FormatType } from '../shared/input-types';
import { LfInputComponent } from '../shared/lf-input.component';
import { SecureComponent } from '../../authorization';

@Component({
    selector: 'lf-statictext',
    templateUrl: './lf-statictext.html',
    inputs: ['disabled', 'hidden', 'authorizationLevel'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{ provide: SecureComponent, useExisting: forwardRef(() => LfStaticText) }]
})
export class LfStaticText extends LfInputComponent<any> implements AfterContentInit {
    @Input()
    public format: FormatType;

    @Input()
    public formatParams: Array<string>;

    @Input()
    public style: any;

    @Input()
    public value: any;

    @Input()
    public renderAsHtml: boolean = true;

    private _pipeFormatHelper: PipeFormatHelper;

    constructor(elementRef: ElementRef<HTMLElement>, cdr: ChangeDetectorRef, pipeFormatHelper: PipeFormatHelper) {
        super(elementRef, cdr);
        this._pipeFormatHelper = pipeFormatHelper;
        this.readonly = true;
    }

    public ngAfterContentInit(): void {
        this.updateValue();
    }

    private updateValue(): void {
        if (this.format) {
            this.value = this._pipeFormatHelper.transform(this.value, this.format, this.formatParams);
        }
    }

    // Declare '_disabled' to satisfy compiler.
    // The actual '_disabled' property is declared in mixinInputDisabled.
    private _disabled: boolean;
    public updateDisabled(value: boolean): void {
        const newValue = this.isDisabledByAuthorization ? true : value;
        if (this._disabled != newValue) {
            this._disabled = newValue;
            this.onDisabledChange();
        }
    }
}
