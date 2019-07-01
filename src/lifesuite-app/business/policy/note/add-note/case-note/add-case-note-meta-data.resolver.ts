import { Injectable } from '@angular/core';
import { ListMap } from 'life-core/model';
import { DirectDataResolverClass } from 'life-core/component/shared';
import { MetadataItem } from 'ls-core/model';
import { BaseMetaDataResolver } from 'ls-core/view-model';

@Injectable()
export class AddCaseNoteMetaDataResolver extends BaseMetaDataResolver
    implements DirectDataResolverClass<ListMap<MetadataItem>> {
    protected getMetadataTypes(): string[] {
        return ['Visibility', 'System', 'Notes_Subject_lines', 'aus_users', 'service_associate'];
    }
}
