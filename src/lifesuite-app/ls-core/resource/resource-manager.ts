import { Injectable } from '@angular/core';

import { MetadataService } from 'ls-core/service/metadata/metadata.service';
import { CodeHolderDTO } from 'ls-core/model';
import { CacheManager, CacheItem } from 'life-core/cache';

/**
 *  ResourceManager manages application resources,
 *  such as dropdown list metadata.
 */
@Injectable()
export class ResourceManager extends CacheManager<Array<CodeHolderDTO>> {
    private _metadataService: MetadataService;

    constructor(metadataService: MetadataService) {
        super();
        this._metadataService = metadataService;
    }

    protected loadValues(keys: Array<string>): Promise<Array<CodeHolderDTO[]>> {
        return this._metadataService.load(keys);
    }

    public getValues(keys: Array<string>): Promise<Array<CacheItem<Array<CodeHolderDTO>>>> {
        return this.getValuesImpl(keys);
    }
}
