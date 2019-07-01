import { Injectable } from '@angular/core';

import { BaseMetaDataResolver } from 'ls-core/view-model';

@Injectable()
export class SearchCaseMetaDataResolver extends BaseMetaDataResolver {
    protected getMetadataTypes(): string[] {
        return ['SearchScreenConfiguration', 'system', 'country', 'country_state_usa', 'country_state_canada'];
    }
}
