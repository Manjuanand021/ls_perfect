import { Injectable } from '@angular/core';

import { BaseMetaDataResolver } from 'ls-core/view-model';

@Injectable()
export class ReinsurerDialogMetaDataResolver extends BaseMetaDataResolver {

    public context: any;

    protected getMetadataTypes(): string[] {
        return ["ReinsurerTreatyType"];
    }
}
