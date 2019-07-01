import { FieldConfig } from '../model/field-config.interface';

export type DependentFieldHandlerContext = {
    dependentField: FieldConfig;
    triggerField: FieldConfig;
    triggerFieldValue: any;
    formFields: FieldConfig[];
    formData: Object;
    additionalContext?: any[];
};

export abstract class DependentFieldHandler {
    public abstract execute(context: DependentFieldHandlerContext): void;
}
