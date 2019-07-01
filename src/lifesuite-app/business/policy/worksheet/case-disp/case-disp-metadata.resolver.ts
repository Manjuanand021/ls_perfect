import { Injectable } from '@angular/core';

import { BaseMetaDataResolver } from 'ls-core/view-model';

@Injectable()
export class CaseDispositionMetaDataResolver extends BaseMetaDataResolver {
    protected getMetadataTypes(): string[] {
        return [
            // Common Section
            'applicant_status',
            'ReinsurerTreatyType',
            'benefit_type',
            'underwriter',
            'plan_code',
            'worksheet_section_configuration',
            'plan_code',
            'System Message'

            // Other Sections
            //  ...
        ];
    }
}
