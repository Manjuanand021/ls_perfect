import { Injectable } from '@angular/core';

import { BaseMetaDataResolver } from 'ls-core/view-model';

@Injectable()
export class RequirementMetaDataResolver extends BaseMetaDataResolver {
    protected getMetadataTypes(): string[] {
        return ['Requirement', 'RequirementStatus', 'underwriter', 'service_associate', 'team'];
    }
}
