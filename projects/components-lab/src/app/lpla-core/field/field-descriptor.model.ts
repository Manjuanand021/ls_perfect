export class FieldDescriptorBase {
    $type: string = 'life.dataService.baseDataService.FieldDescriptorBase, BaseDataService';
    dataTarget: DataTarget;
    uiId: string;
    value: any;
    isAvailable: boolean;
    isApplicable: boolean;
    isEditable: boolean;
    isRequired: boolean;
    isCommittedAsDependent: boolean;
    isValid: boolean;
    isSaveable: boolean;
    viewIndex: number;
	observableModel: ObservableFieldModel;

    setEnabled(enabled: boolean): void {
        this.observableModel.setEnabled(enabled);
    }

    setAvailable(available: boolean): void {
        this.observableModel.setAvailable(available);
    }

}

export class DataTarget {
    dataModelFieldLevelMapTextId: string;
    fieldName: string;
    dependencies: DataTarget[];
    uiDataId: string;
    fieldDataType: string;
    level: number;
    isArray: boolean;
}

export class ObservableFieldModel {
	value: any;
	enabled: boolean;
	available: boolean;
	// Helper method for Masked fields
	unmask: Function

	constructor(value: any, enabled: boolean = true, available: boolean = true, unmask: Function) {
		this.value = value;
		this.enabled = enabled;
		this.available = available;
		this.unmask = unmask;
	}

	bind(eventName, handler): void {
	}

	get(name): any {
	}

	getValue(): any {
	}

	getListValue(): any {
	}

	setValue(value: any): void {
		//this.set('value', value);
	}

	getEnabled(): boolean {
		return true;
		//return this.get('enabled');
	}
	setEnabled(enabled: boolean): void {
		//this.set('enabled', enabled);
	}

	getAvailable(): boolean {
		return true;
		//return this.get('available');
	}
	setAvailable(available: boolean): void {
		//this.set('available', available);
	}

}

/*
export class ObservableFieldModel extends kendo.data.ObservableObject {
    value: any;
    enabled: boolean;
    available: boolean;
    // Helper method for Masked fields
    unmask: Function

    constructor(value: any, enabled: boolean = true, available: boolean = true, unmask: Function) {
        super();

        super.init(this);

        this.value = value;
        this.enabled = enabled;
        this.available = available;
        this.unmask = unmask;
    }

    getValue(): any {
        return this.get('value');
    }
    getListValue(): any {
        let value = this.get('value');
        if (value instanceof Object && value.hasOwnProperty('CodeID')) {
            return value.CodeID;
        } else {
            return value;
        }
    }
    setValue(value: any): void {
        this.set('value', value);
    }

    getEnabled(): boolean {
        return this.get('enabled');
    }
    setEnabled(enabled: boolean): void {
        this.set('enabled', enabled);
    }

    getAvailable(): boolean {
        return this.get('available');
    }
    setAvailable(available: boolean): void {
        this.set('available', available);
    }

}
*/

export class FieldDescriptor<T> extends FieldDescriptorBase {
    $type: string = 'life.dataService.baseDataService.FieldDescriptor, BaseDataService';
    value: T;
    defaultValue: T;
}

export class StringFieldDescriptor extends FieldDescriptor<string> {
    $type: string = 'life.dataService.baseDataService.StringFieldDescriptor, BaseDataService';
    minFieldLength: number;
    maxFieldLength: number;
    isMinLengthInclusive: boolean;
    isMaxLengthInclusive: boolean;
    isMaxLengthSet: boolean;
    isMinLengthSet: boolean;
}

export class RangeFieldDescriptor<T> extends FieldDescriptor<T> {
    $type: string = 'life.dataService.baseDataService.RangeFieldDescriptor, BaseDataService';
    minValue: T;
    maxValue: T;
    isMinInclusive: boolean;
    isMaxInclusive: boolean;
    decimalPlaces: number = 0;
}

export class ListFieldDescriptor<T> extends FieldDescriptor<T> {
    $type: string = 'life.dataService.baseDataService.ListFieldDescriptor, BaseDataService';
    listItems: IListItem<T>[];
    selectedItem: IListItem<T>;
}

export interface IListItem<T> {
    CodeID: T;
    StringValue: string;
}