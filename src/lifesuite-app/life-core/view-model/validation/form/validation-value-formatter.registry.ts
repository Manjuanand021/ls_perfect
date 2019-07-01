import { Injectable } from '@angular/core';

import { IValidationValueFormatter, ValidationValueFormatterRegistryType } from './validation-value-formatter.type';
import { DateFormatter, DecimalFormatter } from 'life-core/util';

@Injectable({
    providedIn: 'root'
})
export class GeneralValueFormmatter implements IValidationValueFormatter {
    public format(value: any): string {
        return value;
    }
}
@Injectable({
    providedIn: 'root'
})
export class DateValueFormmatter implements IValidationValueFormatter {
    private _formatter: DateFormatter;
    constructor(dateFormatter: DateFormatter) {
        this._formatter = dateFormatter;
    }

    public format(value: any): string {
        return this._formatter.format(new Date(value));
    }
}

@Injectable({
    providedIn: 'root'
})
export class NumberValueFormatter implements IValidationValueFormatter {
    private _formatter: DecimalFormatter;
    constructor(decimalFormatter: DecimalFormatter) {
        this._formatter = decimalFormatter;
    }

    public format(value: any): string {
        return this._formatter.format(value);
    }
}

export abstract class ValidationValueFormatterRegistry {
    protected registry: ValidationValueFormatterRegistryType;

    public getFormatter(validatorType: string): IValidationValueFormatter {
        return this.registry[validatorType];
    }

    protected abstract setupRegistry(): void;
}

@Injectable()
export class LfValidationValueFormatterRegistry extends ValidationValueFormatterRegistry {
    protected generalValueFormmatter: GeneralValueFormmatter;
    protected numberValueFormatter: NumberValueFormatter;
    protected dateValueFormmatter: DateValueFormmatter;

    constructor(
        generalValueFormmatter: GeneralValueFormmatter,
        numberValueFormatter: NumberValueFormatter,
        dateValueFormmatter: DateValueFormmatter
    ) {
        super();

        this.generalValueFormmatter = generalValueFormmatter;
        this.numberValueFormatter = numberValueFormatter;
        this.dateValueFormmatter = dateValueFormmatter;

        this.setupRegistry();
    }
    protected setupRegistry(): void {
        this.registry = {
            General: this.generalValueFormmatter,
            Text: this.generalValueFormmatter,
            NumberRange: this.numberValueFormatter,
            DateRange: this.dateValueFormmatter
        };
    }
}
