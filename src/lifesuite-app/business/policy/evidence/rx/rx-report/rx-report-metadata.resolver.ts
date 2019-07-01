import { Injectable } from '@angular/core';

import { BaseMetaDataResolver } from 'ls-core/view-model';

@Injectable()
export class RxReportMetaDataResolver extends BaseMetaDataResolver {
    protected getMetadataTypes(): string[] {
        return ['RxReport'];
    }
}
