import { Injectable } from '@angular/core';

import { CodeHolderDTO, MetadataItem } from 'ls-core/model';
import { ResourceManager } from 'ls-core/resource';
import { CacheItem } from 'life-core/cache';

export type MetadataResult = { [key: string]: Array<MetadataItem> };

/**
 * Helper class to load metadata.
 */
@Injectable()
export class MetadataLoader {
    private _rm: ResourceManager;

    constructor(rm: ResourceManager) {
        this._rm = rm;
    }

    public load(metaTypes: Array<string>): Promise<MetadataResult> {
        return this._rm.getValues(metaTypes).then(metadata => {
            return this.buildMetadataResult(metadata);
        });
    }

    public clear(): void {
        this._rm.destroy();
    }

    private buildMetadataResult(metadata: CacheItem<CodeHolderDTO[]>[]): MetadataResult {
        const result: MetadataResult = {};
        for (const item of metadata) {
            result[item.key] = this.createMetadataList(item.value);
        }
        return result;
    }

    private createMetadataList(metadata: Array<CodeHolderDTO>): Array<MetadataItem> {
        return metadata.map(item => {
            return new MetadataItem(item.CodeValue, item.CodeId, item.ExternalCode);
        });
    }
}
