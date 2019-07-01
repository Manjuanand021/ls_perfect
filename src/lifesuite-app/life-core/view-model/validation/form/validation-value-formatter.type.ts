export interface IValidationValueFormatter {
    format(value: any): string;
}

export type ValidationValueFormatterRegistryType = { readonly [validatorType: string]: IValidationValueFormatter };
