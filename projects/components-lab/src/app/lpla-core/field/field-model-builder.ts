import {FieldDescriptorBase, ObservableFieldModel} from './field-descriptor.model';
import {FieldDescriptorUtil} from './field-descriptor.util';

export class FieldModelBuilder {

    private _fieldDescriptors: FieldDescriptorBase[];

    constructor(fieldDescriptors: FieldDescriptorBase[]) {
        this._fieldDescriptors = fieldDescriptors;
    }

    build(): FieldDescriptorBase[] {
        for (var fieldDescriptor of this._fieldDescriptors) {
            fieldDescriptor.uiId = FieldDescriptorUtil.getUiId(fieldDescriptor);
            fieldDescriptor.observableModel = FieldModelBuilder.createFieldModel(fieldDescriptor);
        }
        return this._fieldDescriptors;
    }

    static createFieldModel(fieldDescriptor: FieldDescriptorBase): ObservableFieldModel {
        return new ObservableFieldModel(
            fieldDescriptor.value,
            fieldDescriptor.isEditable,
            fieldDescriptor.isAvailable,
            FieldModelBuilder.unmask
        );
    }

    static unmask(e): void {
        var that = e.sender,
            stripped = that.raw(),
            obs = e.data,
            val = that.element.data("bind");
        if (val) {
            obs.set('value', stripped);
        }
    }


}