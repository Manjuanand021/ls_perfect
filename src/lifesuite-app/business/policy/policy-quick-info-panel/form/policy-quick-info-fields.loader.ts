import { Injectable } from '@angular/core';

import { FieldConfig, ListFieldConfig, FormListFieldsUtil } from 'life-core/component/dynamic-form';
import {
    FormLoadFieldsService,
    FormFieldNames,
    LsFormTypes,
    DynamicFormFieldsManager
} from 'ls-core/component/dynamic-form';
import { PolicyProxy, PolicyDTO } from 'ls-core/model';
import { MetadataLoader } from 'ls-core/util';
import { AppSession } from 'ls-core/session';

import { PolicyQuickInfoFormDataBuilder, PolicyQuickInfoFormData } from './policy-quick-info-form-data.builder';
import { PolicyQuickInfoFormFields } from './policy-quick-info-form-fields';

@Injectable()
export class PolicyQuickInfoFieldsLoader {
    private _formLoadFieldsService: FormLoadFieldsService;
    private _metadataLoader: MetadataLoader;
    private _dynamicFormFieldsManager: DynamicFormFieldsManager;
    private _policyQuickInfoFormFields: PolicyQuickInfoFormFields;
    private _appSession: AppSession;
    private _policyQuickInfoFormDataBuilder: PolicyQuickInfoFormDataBuilder;

    constructor(
        metadataLoader: MetadataLoader,
        dynamicFormFieldsManager: DynamicFormFieldsManager,
        formLoadFieldsService: FormLoadFieldsService,
        policyQuickInfoFormFields: PolicyQuickInfoFormFields,
        appSession: AppSession,
        policyQuickInfoFormDataBuilder: PolicyQuickInfoFormDataBuilder
    ) {
        this._formLoadFieldsService = formLoadFieldsService;
        this._metadataLoader = metadataLoader;
        this._dynamicFormFieldsManager = dynamicFormFieldsManager;
        this._policyQuickInfoFormFields = policyQuickInfoFormFields;
        this._appSession = appSession;
        this._policyQuickInfoFormDataBuilder = policyQuickInfoFormDataBuilder;
    }

    public load(): Promise<void> {
        return this.getFieldsToDisplay();
    }

    private getFieldsToDisplay(): Promise<void> {
        return this._metadataLoader.load(['side_info_panel_configuration']).then(data => {
            const fieldsToDisplay = data['side_info_panel_configuration'].map(field => field.label);
            return this.loadFormFields(fieldsToDisplay.join(','));
        });
    }

    private loadFormFields(fieldsToDisplay: string): Promise<void> {
        if (!this._policyQuickInfoFormFields.loaded) {
            return this._dynamicFormFieldsManager.getFormFields(LsFormTypes.PolicyQuickInfo).then(response => {
                const fields = response.value as Array<FieldConfig>;
                const filteredFields = this.filterFieldsToDisplay(fields, fieldsToDisplay);
                this.preProcessFormFields(fields);
                return this.getFormData().then(formData => {
                    return this._formLoadFieldsService
                        .load(LsFormTypes.PolicyQuickInfo, fields, filteredFields, formData, this.policy)
                        .then(fieldsArray => this.setupFormFields(fieldsArray));
                });
            });
        }
    }

    private filterFieldsToDisplay(formFields: Array<FieldConfig>, fieldsToDisplay: string): Array<FormFieldNames> {
        const implementedFormFields = formFields.map(fieldConfig => fieldConfig.name.toLowerCase());
        return [fieldsToDisplay.split(',').filter(field => implementedFormFields.indexOf(field.toLowerCase()) >= 0)];
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

    private setupFormFields(fieldsArray: Array<FieldConfig[]>): void {
        this._policyQuickInfoFormFields.set(fieldsArray[0]);
    }

    private getFormData(): Promise<PolicyQuickInfoFormData> {
        return this._policyQuickInfoFormDataBuilder.build(this.policy).then(policyQuickInfoFormData => {
            return policyQuickInfoFormData;
        });
    }

    private get policy(): PolicyDTO {
        return this._appSession.policyDTO;
    }
}
