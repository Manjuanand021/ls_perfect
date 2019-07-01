import {FieldDescriptorBase} from './field-descriptor.model';

export class FieldBindingUtil {

    public static onFieldValueChange(field: FieldDescriptorBase, handler: Function): void {
        FieldBindingUtil.bindToEvent(field, 'change', handler);
    }

	public static onAnyFieldValueChange(fields: FieldDescriptorBase[], handler: Function): void {
		fields.forEach(field => FieldBindingUtil.bindToEvent(field, 'change', handler));
    }

    public static bindToEvent(field: FieldDescriptorBase, eventName: string, handler: Function): void {
        field.observableModel.bind(eventName, handler);
    }

}
