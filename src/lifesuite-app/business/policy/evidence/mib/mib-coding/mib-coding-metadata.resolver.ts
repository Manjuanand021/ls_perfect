import { Injectable } from '@angular/core';

import { BaseMetaDataResolver } from 'ls-core/view-model';

@Injectable()
export class MIBCodingMetaDataResolver extends BaseMetaDataResolver {
    protected getMetadataTypes(): string[] {
        return ['system', 'aus_users'];
    }
}
