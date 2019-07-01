import {FieldDescriptorBase} from '../field-descriptor.model';
import {DataService, DataServiceParams, DataResponse, BusinessServiceAndMethodIds} from 'lpla-core/service';
import {DependantFieldDescriptorRequest} from './dependent-field.request';
import {FieldDescriptorUtil} from '../field-descriptor.util';
//import {FieldDataBinder} from '../field-data-binder';
import {FieldModelBuilder} from '../field-model-builder';
import {BindingContext} from '../binding-context';

export class DependentFieldUpdator {

    private _dataService: DataService;

    private _onDependentFieldsUpdated: (updatedFields: FieldDescriptorBase[]) => void;

    // map of field desriptors by fieldDataId
    private _fieldsDataIdMap: { [uiId: string]: FieldDescriptorBase } = {};

	private _bindingContext: BindingContext;

    constructor(dataService: DataService,
            fieldsMap: { [uiId: string]: FieldDescriptorBase },
			bindingContext: BindingContext, 
            onDependentFieldsUpdated: (updatedFields: FieldDescriptorBase[]) => void) {
        this._dataService = dataService;
        this._fieldsDataIdMap = fieldsMap;
		this._bindingContext = bindingContext;
        this._onDependentFieldsUpdated = onDependentFieldsUpdated;
    }

    public update(modifiedField: FieldDescriptorBase): void {
        let dependentFields: FieldDescriptorBase[] = this.getDependentFields(modifiedField);
        this.prepareFieldsForSave(dependentFields);
        this.getUpdatedDependentFields(dependentFields).then(updatedFields => {
            updatedFields = new FieldModelBuilder(updatedFields).build();
            this.rebindUpdatedFields(updatedFields);
            this._onDependentFieldsUpdated(updatedFields);
        });
    }

    private getDependentFields(modifiedField: FieldDescriptorBase): FieldDescriptorBase[] {
        let fieldDataId: string;
        let dependentField: FieldDescriptorBase;
        let dependentFields: FieldDescriptorBase[] = [];
        if (modifiedField.dataTarget.dependencies.length > 0) {
            for (var dependency of modifiedField.dataTarget.dependencies) {
                fieldDataId = FieldDescriptorUtil.getFieldDataIdByDataTarget(dependency, modifiedField.viewIndex);
                if (dependentFields[fieldDataId] == null) {
                    dependentField = this._fieldsDataIdMap[fieldDataId];
                    dependentFields.push(dependentField);
                }
            }
            dependentFields.push(modifiedField);
        }
        return dependentFields;
    }

    private prepareFieldsForSave(fields: FieldDescriptorBase[]): void {
        for (var field of fields) {
            FieldDescriptorUtil.prepareFieldForSave(field);
        }
    }

    private getUpdatedDependentFields(fields: FieldDescriptorBase[]): Promise<FieldDescriptorBase[]> {
        return this.getDependentFieldsResponse(fields).then(dataResponse => {
            return dataResponse.data.validatedFields;
        });
    }

    private getDependentFieldsResponse(fields: FieldDescriptorBase[]): Promise<any> {
        let params = this.packageServiceParams(new DependantFieldDescriptorRequest(fields));
        return this._dataService.getData(params);
    }

    private packageServiceParams(data: DependantFieldDescriptorRequest): DataServiceParams {
        let params = new DataServiceParams(
            {
                serviceId: BusinessServiceAndMethodIds.DependantFieldDescriptorService,
                methodId: BusinessServiceAndMethodIds.Method_Get,
                data: data
            }
        );
        
        return params;
    }

    private rebindUpdatedFields(fields: FieldDescriptorBase[]): void {
  //      let fieldDataBinder: FieldDataBinder = new FieldDataBinder(this._dataService, fields, this._onDependentFieldsUpdated);
		//fieldDataBinder.bindingContext = this._bindingContext;
  //      fieldDataBinder.rebind();
    }
}
