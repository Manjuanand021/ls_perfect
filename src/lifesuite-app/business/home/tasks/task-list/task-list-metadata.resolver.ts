import { Injectable } from '@angular/core';

import { BaseMetaDataResolver } from 'ls-core/view-model';

@Injectable()
export class TaskListMetaDataResolver extends BaseMetaDataResolver {
    protected getMetadataTypes(): string[] {
        return ['underwriter'];
    }
}
