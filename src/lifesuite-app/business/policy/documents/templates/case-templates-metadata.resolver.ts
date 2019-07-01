import { Injectable } from '@angular/core';

import { BaseMetaDataResolver } from 'ls-core/view-model';

@Injectable()
export class CaseTemplatesMetaDataResolver extends BaseMetaDataResolver {
    protected getMetadataTypes(): string[] {
        return ['correspondence_configuration'];
    }
}
