import { FieldConfig } from '../model/field-config.interface';

export class FormFieldsUtil {
    public static getFormFieldByName(formFields: FieldConfig[], fieldName: string): FieldConfig {
        return formFields.find(field => field.name === fieldName);
    }
}
