export class FormFieldEvent {
    public name: string;
    public value?: any;
    public index?: string;

    constructor({ name, value, index }: { name: string; value?: any; index?: string }) {
        this.name = name;
        this.value = value;
        this.index = index;
    }
}

export class FormDependentFieldEvent {
    public dependentFieldName: string;
    public triggerFieldName: string;
    public triggerFieldValue?: any;

    constructor({
        dependentFieldName,
        triggerFieldName,
        triggerFieldValue
    }: {
        dependentFieldName: string;
        triggerFieldName: any;
        triggerFieldValue?: any;
    }) {
        this.dependentFieldName = dependentFieldName;
        this.triggerFieldName = triggerFieldName;
        this.triggerFieldValue = triggerFieldValue;
    }
}
