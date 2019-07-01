import { Injectable } from '@angular/core';

import { FormLoadFieldsService, LsFormTypes, DynamicFormFieldsManager } from 'ls-core/component/dynamic-form';
import { MetadataLoader } from 'ls-core/util';

import { BaseCoverageFormFieldsLoader } from 'business/policy/shared/coverage-dynamic-form';
import { PlanApplicantCoverageFormFields } from './plan-applicant-coverage-form-fields';

@Injectable()
export class ApplicantCoveragesFieldsLoader extends BaseCoverageFormFieldsLoader {
    constructor(
        formLoadFieldsService: FormLoadFieldsService,
        metadataLoader: MetadataLoader,
        dynamicFormFieldsManager: DynamicFormFieldsManager,
        planApplicantCoverageFormFields: PlanApplicantCoverageFormFields
    ) {
        super(formLoadFieldsService, metadataLoader, planApplicantCoverageFormFields, dynamicFormFieldsManager);
    }

    protected getFormType(): string {
        return LsFormTypes.ApplicantCoverage;
    }

    protected getCoverageConfigurationCodeType(): string {
        return 'coverage_field_configuration';
    }
}
