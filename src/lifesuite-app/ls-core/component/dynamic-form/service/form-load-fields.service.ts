import { Injectable } from '@angular/core';

import { FieldConfig, FormListFieldsUtil } from 'life-core/component/dynamic-form';
import { DirectDataResolve } from 'life-core/component/shared';
import { BaseDTO } from 'ls-core/model';
import { FormLoadMetadataService } from './form-load-metadata.service';
import { FormLoadListDataService } from './form-load-listdata.service';
import { FormLoadResolveDataService } from './form-load-resolvedata.service';
import { DynamicFormFieldsManager } from '../manager/dynamic-form-fields.manager';

@Injectable({ providedIn: 'root' })
export class FormLoadFieldsService {
    private _formLoadMetadataService: FormLoadMetadataService;
    private _formLoadListDataService: FormLoadListDataService;
    private _dynamicFormFieldsManager: DynamicFormFieldsManager;
    private _formLoadResolveDataService: FormLoadResolveDataService;

    constructor(
        formLoadMetadataService: FormLoadMetadataService,
        formLoadListDataService: FormLoadListDataService,
        formLoadResolveDataService: FormLoadResolveDataService,
        dynamicFormFieldsManager: DynamicFormFieldsManager
    ) {
        this._formLoadMetadataService = formLoadMetadataService;
        this._formLoadListDataService = formLoadListDataService;
        this._formLoadResolveDataService = formLoadResolveDataService;
        this._dynamicFormFieldsManager = dynamicFormFieldsManager;
    }

    public load(
        formType: string,
        preloadedFormFields: Array<FieldConfig>,
        fieldNamesForAllForms: Array<FormFieldNames>,
        formData: Object,
        rootDTO: BaseDTO,
        resolve?: Array<DirectDataResolve>
    ): Promise<Array<FieldConfig[]>> {
        return this.loadFormFieldsConfig(formType, preloadedFormFields).then(formFieldsConfig => {
            const loadFieldsResults: Promise<void>[] = [
                this.loadFieldsMetadata(formFieldsConfig),
                this.loadFieldsListData(formFieldsConfig, formData, rootDTO)
            ];
            if (resolve) {
                loadFieldsResults.push(this.loadFieldsResolveData(formFieldsConfig, resolve));
            }
            return Promise.all(loadFieldsResults).then(_ => {
                return this.getIncludedFieldsForAllForms(formFieldsConfig, fieldNamesForAllForms);
            });
        });
    }

    private loadFormFieldsConfig(
        formType: string,
        preloadedFormFields: Array<FieldConfig>
    ): Promise<Array<FieldConfig>> {
        if (preloadedFormFields) {
            return Promise.resolve(preloadedFormFields);
        } else {
            return this._dynamicFormFieldsManager.getFormFields(formType).then(response => {
                return response.value as Array<FieldConfig>;
            });
        }
    }

    private loadFieldsMetadata(fieldsConfig: Array<FieldConfig>): Promise<void> {
        return this._formLoadMetadataService.load(FormListFieldsUtil.getListFieldsWithStaticMetaType(fieldsConfig));
    }

    private loadFieldsListData(fieldsConfig: Array<FieldConfig>, formData: Object, rootDTO: BaseDTO): Promise<void> {
        return this._formLoadListDataService.load(
            FormListFieldsUtil.getListFieldsWithListType(fieldsConfig),
            formData,
            rootDTO
        );
    }

    private loadFieldsResolveData(fieldsConfig: Array<FieldConfig>, resolve: Array<DirectDataResolve>): Promise<void> {
        return this._formLoadResolveDataService.load(
            FormListFieldsUtil.getListFieldsWithResolveType(fieldsConfig),
            resolve
        );
    }

    private getIncludedFieldsForAllForms(
        formFieldsConfig: Array<FieldConfig>,
        fieldNamesForAllForms: Array<FormFieldNames>
    ): Array<FieldConfig[]> {
        return fieldNamesForAllForms.map(formFieldNames => {
            return formFieldNames.map(fieldName => {
                const fieldConfig = formFieldsConfig.find(fieldConfig => this.isFieldMatch(fieldConfig, fieldName));
                if (!fieldConfig) {
                    throw new Error(`Undefined FieldConfig: ${fieldName}`);
                }
                return fieldConfig;
            });
        });
    }

    private isFieldMatch(fieldConfig: FieldConfig, fieldName: string): boolean {
        return fieldConfig.name == fieldName.trim() || fieldConfig.name2 == fieldName.trim();
    }
}

export type FormFieldNames = Array<string>;
