import { Injectable } from '@angular/core';
import { BaseMetaDataResolver } from 'ls-core/view-model';

@Injectable()
export class OtherRisksDialogMetaDataResolver extends BaseMetaDataResolver {
    protected getMetadataTypes(): string[] {
        return ['aus_users'];
    }
}
