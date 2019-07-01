import { Injectable } from '@angular/core';

import { FieldConfig, ListFieldConfig, FormListFieldsUtil } from 'life-core/component/dynamic-form';
import {
    FormLoadFieldsService,
    FormFieldNames,
    LsFormTypes,
    DynamicFormFieldsManager
} from 'ls-core/component/dynamic-form';
import { PolicyProxy, PolicyByProductProxyDTO } from 'ls-core/model';
import { MetadataLoader } from 'ls-core/util';

import { TeamDataResolver } from 'business/shared/resolver';

import { SearchFormDataBuilder, SearchFormData } from './search-form-data.builder';
import { SearchCaseCriteriaFormFields } from './search-case-criteria-form-fields';

@Injectable()
export class SearchCaseCriteriaFieldsLoader {
    private _formLoadFieldsService: FormLoadFieldsService;
    private _metadataLoader: MetadataLoader;
    private _policy: PolicyByProductProxyDTO;
    private _dynamicFormFieldsManager: DynamicFormFieldsManager;
    private _searchCaseCriteriaFormFields: SearchCaseCriteriaFormFields;

    constructor(
        formLoadFieldsService: FormLoadFieldsService,
        metadataLoader: MetadataLoader,
        dynamicFormFieldsManager: DynamicFormFieldsManager,
        searchCaseCriteriaFormFields: SearchCaseCriteriaFormFields
    ) {
        this._formLoadFieldsService = formLoadFieldsService;
        this._metadataLoader = metadataLoader;
        this._dynamicFormFieldsManager = dynamicFormFieldsManager;
        this._searchCaseCriteriaFormFields = searchCaseCriteriaFormFields;
    }

    public load(): Promise<void> {
        return this.getSearchCaseFieldsToDisplay();
    }

    private getSearchCaseFieldsToDisplay(): Promise<void> {
        const CRITERIA_FIELDS_ROW_CODEIDS = [
            'CriteriaFieldsRow1',
            'CriteriaFieldsRow2',
            'CriteriaFieldsRow3',
            'CriteriaFieldsRow4',
            'CriteriaFieldsRow5'
        ];
        return this._metadataLoader.load(['SearchScreenConfiguration']).then(data => {
            const fieldsInRows = data['SearchScreenConfiguration'].filter(
                item => CRITERIA_FIELDS_ROW_CODEIDS.indexOf(item.value) > -1
            );
            const fieldsToDisplay = fieldsInRows.map(fieldRow => fieldRow.label);
            return this.loadFormFieldsForSearchCase(fieldsToDisplay.join(','));
        });
    }

    private loadFormFieldsForSearchCase(fieldsToDisplay: string): Promise<void> {
        if (!this._searchCaseCriteriaFormFields.loaded) {
            return this._dynamicFormFieldsManager.getFormFields(LsFormTypes.Search).then(response => {
                const fields = response.value as Array<FieldConfig>;
                const filteredFields = this.filterFieldsToDisplay(fields, fieldsToDisplay);
                this.preProcessFormFields(fields);
                const resolves = [{ resolveName: 'teamList', resolverClass: TeamDataResolver }];
                return this._formLoadFieldsService
                    .load(LsFormTypes.Search, fields, filteredFields, this.getFormData(), this._policy, resolves)
                    .then(searchFieldsArray => this.setupSearchCaseFormFields(searchFieldsArray));
            });
        }
    }

    private filterFieldsToDisplay(formFields: Array<FieldConfig>, fieldsToDisplay: string): Array<FormFieldNames> {
        const implementedFormFields = formFields.map(fieldConfig => fieldConfig.name);
        return [fieldsToDisplay.split(',').filter(field => implementedFormFields.indexOf(field) >= 0)];
    }

    protected preProcessFormFields(formFields: Array<FieldConfig>): void {
        FormListFieldsUtil.getListFieldsWithDynamicMetaType(formFields).forEach(fieldConfig => {
            if ((fieldConfig as ListFieldConfig) && (<ListFieldConfig>fieldConfig).dynamicType) {
                const fnGetDynamicType = (fieldConfig: ListFieldConfig, formData: Object): string => {
                    const policy = formData as PolicyProxy;
                    return `${fieldConfig.metaType}${
                        policy.ApplicantStatus ? policy.ApplicantStatus.toLowerCase() : ''
                    }`;
                };
                (<ListFieldConfig>fieldConfig).getDynamicType = fnGetDynamicType;
            }
        });
    }

    private setupSearchCaseFormFields(searchFieldsArray: Array<FieldConfig[]>): void {
        this._searchCaseCriteriaFormFields.set(searchFieldsArray[0]);
    }

    private getFormData(): SearchFormData {
        return SearchFormDataBuilder.build(this._policy);
    }
}
