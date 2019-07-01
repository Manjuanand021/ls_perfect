import {
    Component,
    Input,
    Provider,
    ElementRef,
    forwardRef,
    ChangeDetectionStrategy,
    ChangeDetectorRef
} from '@angular/core';

import { SelectItem } from 'primeng/components/common/api';
import { ObjectUtils } from 'primeng/components/utils/objectutils';
import { LfInputComponent } from '../shared/lf-input.component';
import { SecureComponent } from '../../authorization';

export const LISTVALUELABEL_PROVIDERS: Array<Provider> = [ObjectUtils];

@Component({
    selector: 'lf-listvaluelabel',
    templateUrl: './lf-listvaluelabel.html',
    inputs: ['hidden', 'authorizationLevel'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        ...LISTVALUELABEL_PROVIDERS,
        { provide: SecureComponent, useExisting: forwardRef(() => LfListValueLabel) }
    ]
})
export class LfListValueLabel extends LfInputComponent<any> {
    private _value: any;

    private _options: SelectItem[];

    public selectedOption: SelectItem;

    public readonly required: boolean = false;

    protected objectUtils: ObjectUtils;

    constructor(elementRef: ElementRef<HTMLElement>, cdr: ChangeDetectorRef, objectUtils: ObjectUtils) {
        super(elementRef, cdr);
        this.objectUtils = objectUtils;
        this.readonly = true;
    }

    public get value(): any {
        return this._value;
    }

    @Input()
    public set value(val: any) {
        this._value = val;
        this.updateSelectedOption(this._value);
    }

    @Input()
    public get options(): SelectItem[] {
        return this._options;
    }

    public set options(opts: SelectItem[]) {
        this._options = opts;
        this.updateSelectedOption(this.value);
    }

    private updateSelectedOption(val: any): void {
        this.selectedOption = this.findOption(val);
    }

    private findOption(val: any): SelectItem {
        const index = this.findOptionIndex(val, this._options);
        return index != -1 ? this._options[index] : null;
    }

    private findOptionIndex(val: any, opts: SelectItem[]): number {
        let index = -1;
        if (opts) {
            for (let i = 0; i < opts.length; i++) {
                if ((val == null && opts[i].value == null) || this.objectUtils.equals(val, opts[i].value)) {
                    index = i;
                    break;
                }
            }
        }
        return index;
    }
}
