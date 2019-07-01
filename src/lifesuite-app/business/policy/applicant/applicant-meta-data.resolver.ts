import { Injectable } from '@angular/core';

import { BaseMetaDataResolver } from 'ls-core/view-model';
import { CountryStateCodes } from 'business/policy/shared';

@Injectable()
export class ApplicantMetaDataResolver extends BaseMetaDataResolver {
    protected getMetadataTypes(): string[] {
        return [...CountryStateCodes, 'plan_code', 'coverage_section_configuration', 'occupation', 'applicant_status'];
    }
}
