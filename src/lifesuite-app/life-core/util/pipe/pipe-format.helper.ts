import { Injector, Injectable, Type, PipeTransform } from '@angular/core';

import { FormatType } from 'life-core/component/input';
import { LfDatePipe } from './lf-date.pipe';
import { LfCurrencyPipe } from './lf-currency.pipe';
import { LfDecimalPipe } from './lf-decimal.pipe';

@Injectable({
    providedIn: 'root'
})
export class PipeFormatHelper {
    private _injector: Injector;

    constructor(injector: Injector) {
        this._injector = injector;
    }

    public transform(value: any, format: FormatType, args: any[]): any {
        const pipeType = FormatToPipeMap[format];
        console.assert(pipeType !== undefined, format);
        const pipe = this._injector.get(pipeType);
        return pipe.transform(value, ...args);
    }
}

const FormatToPipeMap: { readonly [format: string]: Type<PipeTransform> } = {
    date: LfDatePipe,
    number: LfDecimalPipe,
    currency: LfCurrencyPipe
};
