import { Injectable } from '@angular/core';

import { FormLoadFieldsService, LsFormTypes, DynamicFormFieldsManager } from 'ls-core/component/dynamic-form';
import { MetadataLoader } from 'ls-core/util';

import { BaseCoverageFormFieldsLoader } from 'business/policy/shared/coverage-dynamic-form';
import { PlanWorksheetCoverageFormFields } from './plan-worksheet-coverage-form-fields';

@Injectable()
export class WorksheetCoverageFormFieldsLoader extends BaseCoverageFormFieldsLoader {
    constructor(
        formLoadFieldsService: FormLoadFieldsService,
        metadataLoader: MetadataLoader,
        planWorksheetCoverageFormFields: PlanWorksheetCoverageFormFields,
        dynamicFormFieldsManager: DynamicFormFieldsManager
    ) {
        super(formLoadFieldsService, metadataLoader, planWorksheetCoverageFormFields, dynamicFormFieldsManager);
    }

    protected getFormType(): string {
        return LsFormTypes.PolicyCoverage;
    }

    protected getCoverageConfigurationCodeType(): string {
        return 'worksheet_field_configuration';
    }
}
