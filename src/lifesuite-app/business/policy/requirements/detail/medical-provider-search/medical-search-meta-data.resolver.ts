import { Injectable } from '@angular/core';

import { BaseMetaDataResolver } from 'ls-core/view-model';

@Injectable()
export class MedicalSearchMetaDataResolver extends BaseMetaDataResolver {
    protected getMetadataTypes(): string[] {
        return ['country_state_usa', 'country_state_canada', 'MedicalProviderSearchType'];
    }
}
