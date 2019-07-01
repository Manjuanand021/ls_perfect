import {
    FieldDescriptorBase,
    FieldDescriptor,
    FieldModel,
    ListFieldModel,
    StringFieldDescriptor,
    RangeFieldDescriptor,
    ListFieldDescriptor,
    IListItem
} from 'lpla-core/field';

export class TestInputsUtil {
    public static createStringFieldDescriptor(
        uiId: string,
        fieldValue: string,
        editable: boolean = true
    ): FieldDescriptorBase {
        let fd = new StringFieldDescriptor();
        fd.uiId = uiId;
        fd.value = fieldValue;
        fd.isEditable = editable;
        fd.isAvailable = true;
        return fd;
    }

    public static createBooleanFieldDescriptor(
        uiId: string,
        fieldValue: boolean,
        editable: boolean
    ): FieldDescriptorBase {
        let fd = new BooleanFieldDescriptor();
        fd.uiId = uiId;
        fd.value = fieldValue;
        fd.isEditable = editable;
        fd.isAvailable = true;
        return fd;
    }

    public static createNumericFieldDescriptor(
        uiId: string,
        fieldValue: number,
        minValue: number,
        maxValue: number,
        editable: boolean = true,
        decimalPlaces: number
    ): FieldDescriptorBase {
        let fd = new RangeFieldDescriptor<number>();
        fd.uiId = uiId;
        fd.value = fieldValue;
        fd.minValue = minValue;
        fd.maxValue = maxValue;
        fd.isEditable = editable;
        fd.isAvailable = true;
        fd.decimalPlaces = decimalPlaces;
        fd.isRequired = true;
        return fd;
    }

    public static createDateFieldDescriptor(
        uiId: string,
        fieldValue: Date,
        minValue: Date = null,
        maxValue: Date = null,
        editable: boolean = true
    ): FieldDescriptorBase {
        let fd = new RangeFieldDescriptor<Date>();
        fd.uiId = uiId;
        fd.value = fieldValue;
        fd.isEditable = editable;
        fd.isAvailable = true;
        fd.minValue = minValue;
        fd.maxValue = maxValue;
        return fd;
    }

    public static createListFieldDescriptor<T>(
        uiId: string,
        fieldValue: T,
        list: IListItem<T>[],
        editable: boolean = true
    ): FieldDescriptorBase {
        let fd = new ListFieldDescriptor<T>();
        fd.uiId = uiId;
        fd.value = fieldValue;
        fd.listItems = list;
        fd.isEditable = editable;
        fd.isAvailable = true;
        //fd.selectedItem = list[0];
        return fd;
    }

    public static createRadioFieldDescriptor(uiId: string, fieldValue: number): FieldDescriptorBase {
        let fd = new FieldDescriptor<number>();
        fd.uiId = uiId;
        fd.value = fieldValue;
        return fd;
    }

    public static createFieldsMap(fieldDescriptors: FieldDescriptorBase[]): IFields {
        const fields: IFields = {};
        for (let fd of fieldDescriptors) {
            if (fd instanceof ListFieldDescriptor) {
                fields[fd.uiId] = new ListFieldModel(fd.value, fd);
            } else {
                fields[fd.uiId] = new FieldModel(fd.value, fd);
            }
        }
        return fields;
    }
}

export interface IFields {
    [id: string]: FieldModel;
}

export class BooleanFieldDescriptor extends FieldDescriptor<boolean> {
    $type: string = 'life.dataService.baseDataService.BooleanFieldDescriptor, BaseDataService';
}
