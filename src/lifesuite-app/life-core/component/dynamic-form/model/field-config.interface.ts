import { ValidatorFn } from '@angular/forms';

import { FormatType } from 'life-core/component/input';
import { FieldLayoutConfig } from './layout-config.interface';

export type DynamicFieldType =
    | 'button'
    | 'checkbox'
    | 'daterange'
    | 'dropdown'
    | 'hyperlink'
    | 'inputdate'
    | 'inputemail'
    | 'inputmask'
    | 'inputnumber'
    | 'inputtaxid'
    | 'inputtext'
    | 'inputtextarea'
    | 'listvaluelabel'
    | 'radiobuttongroup'
    | 'select'
    | 'statictext';

export interface FieldConfig {
    disabled?: boolean;
    label?: string;
    name: string;
    name2?: string;
    placeholder?: string;
    type: DynamicFieldType;
    validation?: ValidatorFn[];
    value?: any;
    dataPath?: string;
    dataProperty?: string;
    data?: Object;
    required?: boolean;
    layout?: FieldLayoutConfig;
    style?: Object;
    resolveType?: string;
    raiseEvent?: boolean;
    /**
     *  Array of field names dependent on this field.
     */
    dependentFields?: string[];
    cssClass: string;
}

export interface Range<T> {
    min: T;
    max: T;
}

export interface RangeFieldConfig<T> extends FieldConfig {
    range?: Range<T>;
}

export interface NumberFieldConfig extends RangeFieldConfig<number> {
    decimals?: number;
    format?: string;
    maxLength?: number;
    allowNegative?: boolean;
}

export interface DateFieldConfig extends RangeFieldConfig<Date> {}

export interface ListFieldConfig extends FieldConfig {
    options?: any[];
    listLabelProperty?: string;
    listValueProperty?: string;
    metaType?: string;
    listType?: string;
    resolveType?: string;
    dynamicType?: boolean;
    getDynamicType?: (fieldConfig: ListFieldConfig, model: any) => string;
    clearable?: boolean;
}

export interface RadioButtonGroupFieldConfig extends FieldConfig {
    options?: any[];
}

export interface MaskFieldConfig extends FieldConfig {
    mask?: string;
}

export interface StaticTextConfig extends FieldConfig {
    format?: FormatType;
    formatParams?: Array<string>;
}
