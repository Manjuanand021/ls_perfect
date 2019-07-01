import { Injectable, Injector } from '@angular/core';

import { ViewModel } from 'life-core/view-model';
import { SaveDataResult } from 'life-core/service';
import { BusinessServiceAndMethodIds } from 'lpla-core/service/business-service-method-ids';
import { FieldDataManager, FieldDescriptorBase, BindingContext, DataConfigUrlRequest } from 'lpla-core/field';
import { FormInputAccessor } from 'life-core/component/input';

export type FieldsMapType = { [uiId: string]: FieldDescriptorBase };
/**
 * Defines base EditorViewModel class to use for all field-based view models.
 */
@Injectable()
export abstract class EditorViewModel extends ViewModel {
    // Path to the field data *.dat file. Override in derived classes.
    public static FieldDataFileUrl: string;

    protected fieldDataManager: FieldDataManager;

    // Map of Field desriptors by uiId
    protected fields: FieldsMapType = {};

    protected preloadedFields: string[] = [];

    protected formValidator: any; //kendo.ui.Validator;

    constructor(injector: Injector) {
        super(injector);
    }

    public onNgModelChange(control: FormInputAccessor, value: any): void {
        const fieldModel = (control as any).fieldModel as FieldDescriptorBase;
        fieldModel.value = value;
    }

    private getFieldDataManagerFromRoute(): FieldDataManager {
        return this.routerAccessor.getDataFromRoute<FieldDataManager>('fieldDataManager');
    }

    /**
     * Loads ViewModel data.
     */
    public loadData(): Promise<void> {
        let fieldDataManager = this.getFieldDataManagerFromRoute();
        if (fieldDataManager) {
            return this.loadFieldsData(fieldDataManager);
        } else {
            return this.initFieldsDataManagerAndLoadFieldsData();
        }
    }

    private loadFieldsData(fieldDataManager: FieldDataManager): Promise<void> {
        this.fieldDataManager = fieldDataManager;
        this.setFields(this.fieldDataManager.initFields());
        this.fieldDataManager.dependentFieldsUpdatedCallback = this.dependentFieldsUpdatedCallback;
        return Promise.resolve(null);
    }

    private initFieldsDataManagerAndLoadFieldsData(): Promise<void> {
        this.fieldDataManager = this.injector.get(FieldDataManager);
        this.fieldDataManager.dependentFieldsUpdatedCallback = this.dependentFieldsUpdatedCallback;
        let fieldDataFileUrl = this.getFieldDataFileUrl();
        let payload: any = this.getDataConfigUrlRequest();
        return this.fieldDataManager
            .load(fieldDataFileUrl, this.loadFieldsDataServiceId, this.loadFieldsDataMethodId, payload)
            .then(response => {
                this.setFields(this.fieldDataManager.initFields());
            });
    }

    private getFieldDataFileUrl(): string {
        const viewModelClass = <typeof EditorViewModel>this.constructor;
        return viewModelClass.FieldDataFileUrl;
    }

    protected getDataConfigUrlRequest(): DataConfigUrlRequest {
        let dataConfigUrlRequest = new DataConfigUrlRequest();
        return dataConfigUrlRequest;
    }

    private setFields(fields: FieldsMapType): void {
        this.fields = fields;
    }

    /**
     * Saves updated ViewModel data.
     */
    public saveData(): Promise<any> {
        // TODO - consolidate into one service call
        let serviceId = this.saveFieldsDataServiceId;
        let methodId = this.saveFieldsDataMethodId;
        return this.fieldDataManager.save(serviceId, methodId, this.forceSave).then(data => {
            if (this.isRoot) {
                return this.saveChildren().then(() => {
                    return data; // combine with data returned from Children
                });
            } else {
                return data;
            }
        });
    }

    /**
     * Saves data of child ViewModels.
     */
    protected saveChildren(): Promise<any> {
        const children = this.parentChildRegistry.children;
        var saveResults: Promise<SaveDataResult>[] = [];
        for (let child of children) {
            console.debug(`Data saved for child component Id= ${child.constructor.name}`);
            saveResults.push(child.saveData());
        }
        return Promise.all(saveResults);
    }

    protected get forceSave(): boolean {
        return false;
    }

    protected isSaveSuccess(saveResponse: any): boolean {
        return saveResponse == null || saveResponse.data.isSaved == true;
    }

    /**
     * Setup data before view is shown.
     */
    protected setupData(): void {
        this.setupFields();
        this.bindFields();
        this.createFormValidator();
        this.addFieldWatches();
    }

    /**
     * Override in derived ViewModel classes
     * to do additional fields setup.
     */
    protected setupFields(): void {}

    protected dataExist(): boolean {
        for (var property in this.fields) {
            if (this.fields[property].value != null && !this.preloadedFields.some(fieldName => fieldName == property)) {
                return true;
            }
        }
        return false;
    }

    protected bindFields(): void {
        //let bindingContext = new BindingContext(this.formId, this.getDOMContext());
        let bindingContext: BindingContext;
        this.fieldDataManager.bindFields(bindingContext);
    }

    protected createFormValidator() {
        //this.formValidator = FormValidatorCreator.getFormValidator(this.formId);
    }

    protected addFieldWatches(): void {}

    protected isValidatable(): boolean {
        return true;
    }

    private dependentFieldsUpdatedCallback = (updatedFields: FieldDescriptorBase[]): void => {
        this.onDependentFieldsUpdated(updatedFields);
    };

    /**
     * dependent fields updated callback
     */
    protected onDependentFieldsUpdated(updatedFields: FieldDescriptorBase[]): void {}

    protected watchFieldDescriptors(fields: FieldDescriptorBase[], handler: Function): void {
        fields.forEach(field => {
            this.watchFieldDescriptor(field, handler);
        });
    }

    protected watchFieldDescriptor(field: FieldDescriptorBase, handler: Function): void {
        this.fieldDataManager.watchFieldDescriptor(field, handler);
    }

    protected get saveFieldsDataServiceId(): string {
        return BusinessServiceAndMethodIds.FieldDescriptorPersistenceService;
    }

    protected get saveFieldsDataMethodId(): string {
        return BusinessServiceAndMethodIds.Method_Save;
    }

    protected get loadFieldsDataServiceId(): string {
        return BusinessServiceAndMethodIds.TemplateFieldDataService;
    }

    protected get loadFieldsDataMethodId(): string {
        return BusinessServiceAndMethodIds.Method_Get;
    }
}
