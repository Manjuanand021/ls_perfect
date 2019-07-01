import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { ListMap } from 'life-core/model';
import { MetadataItem } from 'ls-core/model';
import { MetadataLoader } from 'ls-core/util';
import { RouteResolve, DirectResolve } from 'life-core/view-model/data-resolver';

/**
 *  Base meta data resolver class to pre-fetch data for components(ViewModels).
 */
@Injectable()
export abstract class BaseMetaDataResolver
    implements RouteResolve<ListMap<MetadataItem>>, DirectResolve<ListMap<MetadataItem>> {
    private _metadataLoader: MetadataLoader;

    constructor(metadataLoader: MetadataLoader) {
        this._metadataLoader = metadataLoader;
    }

    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<ListMap<MetadataItem>> {
        return this.loadData();
    }

    public directResolve(): Promise<ListMap<MetadataItem>> {
        return this.loadData();
    }

    protected loadData(): Promise<ListMap<MetadataItem>> {
        return this.loadMetadata();
    }

    protected loadMetadata(): Promise<ListMap<MetadataItem>> {
        const metadataTypes: Array<string> = this.getMetadataTypes();
        if (metadataTypes == null || metadataTypes.length == 0) return Promise.resolve(null);
        return this._metadataLoader.load(metadataTypes).then(data => {
            const listData: ListMap<MetadataItem> = {};
            Object.assign(listData, data);
            return listData;
        });
    }

    protected abstract getMetadataTypes(): string[];
}
