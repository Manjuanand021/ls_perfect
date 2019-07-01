import {FieldDescriptorBase} from '../field-descriptor.model';
import {DataServiceParams, DataResponse, DataService} from 'lpla-core/service';
import {FieldDescriptorUtil} from '../field-descriptor.util';
import {FieldBindingUtil} from '../field-binding.util';
import {DependentFieldUpdator} from './dependent-field.updator';
import {BindingContext} from '../binding-context';

export class DependentFieldHandler {

    private _dataService: DataService;

	// Array of FieldDescriptors retrieved from server
	private _fieldDescriptors: FieldDescriptorBase[] = [];

    // Map of field desriptors by fieldDataId. Necessary because Server-side Dependent Fields
    // do not have uiDataId.
    private _fieldsDataIdMap: { [uiId: string]: FieldDescriptorBase } = {};

    private _dependentFieldUpdator: DependentFieldUpdator;

    private _onDependentFieldsUpdated: (updatedFields: FieldDescriptorBase[]) => void;

	private _bindingContext: BindingContext;

    constructor(dataService: DataService,
			bindingContext: BindingContext, 
            onDependentFieldsUpdated: (updatedFields: FieldDescriptorBase[]) => void) {
        this._dataService = dataService;
		this._bindingContext = bindingContext;
        this._onDependentFieldsUpdated = onDependentFieldsUpdated;
    }

    public processFields(fieldDescriptors: FieldDescriptorBase[]): void {
        this._fieldDescriptors = fieldDescriptors;
        this.createFieldsDataIdHash();
        this._dependentFieldUpdator = new DependentFieldUpdator(this._dataService, this._fieldsDataIdMap, this._bindingContext, this._onDependentFieldsUpdated);
        let fieldsWithDependents: FieldDescriptorBase[] = this.getFieldsWithDependents();
        for (var fieldWithDependent of fieldsWithDependents) {
            this.addFieldWatchHandler(fieldWithDependent);
        }
    }

    private createFieldsDataIdHash(): void {
        for (var fd of this._fieldDescriptors) {
            let fieldDataId: string = FieldDescriptorUtil.getFieldDataId(fd);
            this._fieldsDataIdMap[fieldDataId] = fd;
        }
    }

    private getFieldsWithDependents(): FieldDescriptorBase[] {
        return this._fieldDescriptors.filter(x => x.dataTarget.dependencies.length > 0);
    }

    private addFieldWatchHandler(field: FieldDescriptorBase): void {
        var context: DependentFieldHandler = this;
        var watchFieldHandler = function(e: any) {
            if (e.field == "value") {
                context._dependentFieldUpdator.update(field);
            }
        }
		FieldBindingUtil.onFieldValueChange(field, watchFieldHandler);
    }
}
