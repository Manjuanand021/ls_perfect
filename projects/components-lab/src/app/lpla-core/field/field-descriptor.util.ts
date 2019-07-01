import {DataTarget, FieldDescriptorBase, ListFieldDescriptor} from './field-descriptor.model';

export class FieldDescriptorUtil {

    public static hasFieldDataIdProperties(field: FieldDescriptorBase): boolean {
        return field.dataTarget.dataModelFieldLevelMapTextId != null &&
            field.dataTarget.fieldName != null;
    }

    public static prepareFieldForSave(field: FieldDescriptorBase): void {
        field.value = this.getUpdatedFieldValue(field);
		if (this.isListFieldDescriptor(field)) {
			(<ListFieldDescriptor<any>>field).listItems = null;
		}
		//fd.observableModel = null;
    }

    private static getUpdatedFieldValue(field: FieldDescriptorBase): any {
        let newValue: any = field.observableModel.value;
        // For a ListFieldDescriptor, the new value is IListItem; need to retreive value from it.
        if (newValue instanceof Object && newValue.hasOwnProperty('CodeID')) {
            return newValue.CodeID;
        }
        // CheckBox checked property is using boolean while field descriptor value is number
        else if (typeof field.value == 'number' && typeof newValue == 'boolean') {
            return (newValue == null || newValue == undefined) ? null : (newValue ? 1 : 0);
        } else {
            return newValue;
        }
    }
	
	public static isListFieldDescriptor(field: FieldDescriptorBase): boolean {
		return (<ListFieldDescriptor<any>>field).listItems != null;
	}

    public static getUiId(field: FieldDescriptorBase): string {
        return this.getUiIdByDataTarget(field.dataTarget, field.viewIndex);
	}

    public static getUiIdByDataTarget(dataTarget: DataTarget, viewIndex: number): string {
        return this.getIdWithViewIndex(dataTarget.uiDataId, viewIndex);
    }

    public static getFieldDataId(field: FieldDescriptorBase): string {
        return this.getFieldDataIdByDataTarget(field.dataTarget, field.viewIndex);
    }

    public static getFieldDataIdByDataTarget(dataTarget: DataTarget, viewIndex: number): string {
        let fieldDataId: string = this.getFieldDataUniqueId(dataTarget.dataModelFieldLevelMapTextId, dataTarget.fieldName);
        if (dataTarget.level != null || dataTarget.isArray) {
            fieldDataId = this.getIdWithArrayLevel(fieldDataId, dataTarget.level);
        }
        return this.getIdWithViewIndex(fieldDataId, viewIndex);
    }

    private static getIdWithViewIndex(id: string, viewIndex: number): string {
        return viewIndex != null ? id + "_" + viewIndex : id;
    }

    private static getFieldDataUniqueId(dataModelFieldLevelMapTextId: string, fieldName: string): string {
        return dataModelFieldLevelMapTextId + "_" + fieldName;
    }

    private static getIdWithArrayLevel(id: string, level: number): string {
        return (level != null) ? id + "_" + level : id;
    }
}
