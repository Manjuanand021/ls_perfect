import { Injectable, Pipe, PipeTransform } from '@angular/core';

import { LsAppConfig, SystemSetting } from 'ls-core/config';
import { MaskPipe } from './mask.pipe';
/*
 * Mask TaxID information
*/
@Pipe({
    name: 'taxIdMask'
})
@Injectable()
export class TaxIdMaskPipe implements PipeTransform {
    private _appConfig: LsAppConfig;

    constructor(appConfig: LsAppConfig) {
        this._appConfig = appConfig;
    }

    public transform(value: string, unmaskCount: number = 4, maskValue: string = '*'): string {
        const maskSetting = this._appConfig.getSystemSetting(SystemSetting.TaxIDMasking);
        return maskSetting && maskSetting.toUpperCase() == 'TRUE'
            ? new MaskPipe().transform(value, 'UNMASK', unmaskCount, false, maskValue)
            : value;
    }
}
