import {Injectable} from '@angular/core';
import {Subscription} from 'rxjs';

import {DataService, DataServiceParams, ViewDataService} from 'lpla-core/service';

import {FieldDescriptorBase} from './field-descriptor.model';
import {FieldModelBuilder} from './field-model-builder';
import {FieldDataWatcher} from './field-data-watcher';
import {FieldDescriptorUtil} from './field-descriptor.util';
import {BindingContext} from './binding-context';
/**
 * Responsible for loading, saving and other field-related operations 
 * for fields on a view
 */

//TODO: Setup as Transient service
//@transient()
@Injectable()
export class FieldDataManager {

    private _viewDataService: ViewDataService;

    private _dataService: DataService;

    // field desriptors
    private _fieldDescriptors: FieldDescriptorBase[] = [];

    // map of field desriptors by uiId
    private _fieldsMap: { [uiId: string]: FieldDescriptorBase } = {};

    private _fieldDataWatcher: FieldDataWatcher;

    // notification _messages
    private _messages: any[] = [];

    // callback after dependent fields are updated
    public dependentFieldsUpdatedCallback: (updatedFields: FieldDescriptorBase[]) => void;

    constructor(private viewDataService: ViewDataService, private dataService: DataService) {
		console.log("FieldManager - constructor");
        this._viewDataService = viewDataService;
        this._dataService = dataService;
        this._fieldDataWatcher = new FieldDataWatcher();

		//console.log('FieldManager - constructor was called');
	}

	/**
	* Load data.
	*/
	public load(fieldDataFileUrl: string, serviceId: string, methodId: string, payload: any): Promise<void> {
		return this._viewDataService.getFieldsData(fieldDataFileUrl, serviceId, methodId, payload)
            .then(response => {
                this._fieldDescriptors = response.data;
            })
            .catch(reason => this.handleError(reason));
    }

	/**
	 * Saves updated data.
	 */
    public save(serviceId: string, methodId: string, forceSave: boolean): Promise<any> {
        let fieldsToSave: Array<FieldDescriptorBase> = this.getFieldsToSave(this._fieldsMap, forceSave);
        if (fieldsToSave.length > 0) {
            let params: DataServiceParams = this.packageServiceParams(serviceId, methodId, fieldsToSave);
            return this._dataService.updateData(params)
                .then(response => {
                    if (response.hasMessages) {
                        // show error _messages
                        this._messages = response.messages;
                    }
                    return response;
                })
                .catch(reason => this.handleError(reason));
        } else {
            return Promise.resolve(null);
        }
    }

    private packageServiceParams(serviceId: string, methodId: string, fieldsData: Array<FieldDescriptorBase>): DataServiceParams {
        var params = new DataServiceParams({ serviceId: serviceId, methodId: methodId, fieldsData: fieldsData});
        return params;
    }

    private getFieldsToSave(fieldsMap: { [uiId: string]: FieldDescriptorBase }, forceSave: boolean): Array<FieldDescriptorBase> {
        let modifiedFields: Array<FieldDescriptorBase> = [];
        for (let key in fieldsMap) {
            let fd: FieldDescriptorBase = this._fieldsMap[key];
            if (fd && this.needToSaveField(fd, forceSave)) {
                FieldDescriptorUtil.prepareFieldForSave(fd);
                modifiedFields.push(fd);
                //this._logger.warn("Save field: ", fd.uiId, ' = ', fd.value);
            }
        }
        return modifiedFields;
    }

    public initFields() {
        // create field observable models
        this.createFieldModels();

        // create Fields data map
        this.createFieldsMap();

        return this._fieldsMap;
    }

    private createFieldModels(): void {
        this._fieldDescriptors = new FieldModelBuilder(this._fieldDescriptors).build();
    }

    private createFieldsMap(): void {
        for (var fd of this._fieldDescriptors) {
            this._fieldsMap[fd.uiId] = fd;
        }
    }

    public bindFields(bindingContext: BindingContext): void {
    }

    public onDependentFieldsUpdated = (updatedFields: FieldDescriptorBase[]): void => {
        this.updateFieldIdMap(updatedFields);
        this.attachWatchHandlersForUpdatedFields(updatedFields);
        this.dependentFieldsUpdatedCallback(updatedFields);
    }

    private updateFieldIdMap(updatedFields: FieldDescriptorBase[]): void {
        for (var field of updatedFields) {
            this._fieldsMap[field.uiId] = field;
        }
    }

    private attachWatchHandlersForUpdatedFields(updatedFields: FieldDescriptorBase[]): void {
        this._fieldDataWatcher.attachWatchHandlersForFields(updatedFields);
    }

    public rebindFields(fieldDescriptors: FieldDescriptorBase[]): void {
    }

    private needToSaveField(fd: FieldDescriptorBase, forceSave: boolean): boolean {
        let newValue: any = fd.observableModel.value;
        return (fd.isSaveable != false) && fd.observableModel.get('enabled') && (newValue != fd.value || forceSave);
    }

    public watchFieldDescriptor(field: FieldDescriptorBase, handler: Function): void {
        this._fieldDataWatcher.watchFieldDescriptor(field, handler);
    }

    protected handleError(reason: string): void {
        this._messages = [reason];
        //this._logger.error(`FieldManager -> error: ${reason}`);
    }

    destroy(): void {
        this._fieldDescriptors = [];
        this._fieldsMap = null;
        this._fieldDataWatcher.destroy();
    }
}