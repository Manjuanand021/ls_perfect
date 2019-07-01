import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { PipeFormatHelper } from 'life-core/util/pipe';
import { AbstractDynamicFormInput } from './dynamic-form-input';
import { StaticTextConfig } from '../model/field-config.interface';

import { Pipe, PipeTransform } from '@angular/core';
/*
 * Translate value into string based on config parameters
 * Usage:
 *   value | staticTextConfig: StaticTextConfig
 */
@Pipe({ name: 'lfStaticTextConfig' })
export class LfFormStaticTextConfigPipe implements PipeTransform {
    private _pipeFormatHelper: PipeFormatHelper;

    constructor(pipeFormatHelper: PipeFormatHelper) {
        this._pipeFormatHelper = pipeFormatHelper;
    }

    public transform(value: any, config: StaticTextConfig): string {
        const valueToTransform = this.prepareValue(value, config);
        if (config.format) {
            return this._pipeFormatHelper.transform(valueToTransform, config.format, config.formatParams);
        } else {
            return valueToTransform;
        }
    }

    protected prepareValue(value: any, config: StaticTextConfig): any {
        return value == null || value == undefined ? '' : value;
    }
}

@Component({
    selector: 'lf-form-statictext',
    template: `
        <lf-form-input [control]="formStaticText" [label]="config.label">
            <lf-statictext
                #formStaticText
                [name]="config.name + index"
                [authorizationLevel]="authorizationLevel"
                [value]="data ? (data[config.dataProperty] | lfStaticTextConfig: config) : ''"
                [disabled]="config.disabled"
            >
            </lf-statictext>
        </lf-form-input>
    `
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class LfFormStaticTextComponent extends AbstractDynamicFormInput {
    constructor(cdr: ChangeDetectorRef) {
        super(cdr);
    }
}
