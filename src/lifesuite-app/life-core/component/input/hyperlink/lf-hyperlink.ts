import {
    Component,
    Input,
    Output,
    EventEmitter,
    ElementRef,
    forwardRef,
    AfterContentInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef
} from '@angular/core';

import { PipeFormatHelper } from 'life-core/util/pipe';
import { SecureComponent } from './../../authorization';
import { FormatType } from '../shared/input-types';
import { LfInputComponent } from '../shared/lf-input.component';

@Component({
    selector: 'lf-hyperlink',
    templateUrl: './lf-hyperlink.html',
    inputs: ['disabled', 'authorizationLevel'],
    styleUrls: ['./lf-hyperlink.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{ provide: SecureComponent, useExisting: forwardRef(() => LfHyperlink) }]
})
export class LfHyperlink extends LfInputComponent<any> implements AfterContentInit {
    @Input()
    public styleClass: string;

    @Input()
    public value: any;

    @Input()
    public format: FormatType;

    @Input()
    public formatParams: Array<string>;

    @Output()
    public click: EventEmitter<any> = new EventEmitter();

    private _pipeFormatHelper: PipeFormatHelper;

    constructor(elementRef: ElementRef<HTMLElement>, cdr: ChangeDetectorRef, pipeFormatHelper: PipeFormatHelper) {
        super(elementRef, cdr);
        this._pipeFormatHelper = pipeFormatHelper;
    }

    public onHyperlinkClick(event: Event): void {
        event.stopPropagation();
        this.click.emit(this);
    }

    public ngAfterContentInit(): void {
        this.updateValue();
    }

    private updateValue(): void {
        if (this.format) {
            this.value = this._pipeFormatHelper.transform(this.value, this.format, this.formatParams);
        }
    }
}
