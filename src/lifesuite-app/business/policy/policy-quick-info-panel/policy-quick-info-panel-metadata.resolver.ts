import { Injectable } from '@angular/core';
import { ListMap } from 'life-core/model';
import { DirectDataResolverClass } from 'life-core/component/shared';
import { MetadataItem } from 'ls-core/model';
import { BaseMetaDataResolver } from 'ls-core/view-model';

@Injectable()
export class PolicyQuickInfoPanelMetaDataResolver extends BaseMetaDataResolver
    implements DirectDataResolverClass<ListMap<MetadataItem>> {
    protected getMetadataTypes(): string[] {
        return [
            'applicant_status',
            'plan_code',
            'ApplicationType',
            'association',
            'tpa_name',
            'service_associate',
            'underwriter',
            'requirement'
        ];
    }
}
