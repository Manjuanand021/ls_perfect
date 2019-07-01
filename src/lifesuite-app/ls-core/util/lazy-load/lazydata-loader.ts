import { Injectable } from '@angular/core';

import { Logger, ILogger } from 'life-core/logging';
import { LazyLoadService } from 'ls-core/service/lazy-load/lazy-load.service';
import { BaseDTO } from 'ls-core/model';
import { NTree } from 'ls-core/service/load-bypk';
import { LazyLoadTreeHelper } from './lazy-load-tree-helper';

/**
 * Helper class to preload data for ViewModels.
 */
@Injectable()
export class LazyDataLoader {
    private _lazyLoadService: LazyLoadService;
    private _logger: ILogger;

    constructor(lazyLoadService: LazyLoadService, logger: Logger) {
        this._lazyLoadService = lazyLoadService;
        this._logger = logger;
    }

    public load(request: LazyLoadItemsRequest): Promise<Array<any>> {
        const loadResults: Array<Promise<any>> = [];
        if (request.lazyLoadItems.length > 1) {
            this._logger.warn(
                'It is recommended to use batchLoad instead of load method for lazy loading multiple collections.'
            );
        }
        request.lazyLoadItems.forEach(item => {
            if (this.needToLoad(item)) {
                loadResults.push(this._lazyLoadService.doLazyLoad(item));
            } else loadResults.push(Promise.resolve(true));
        });
        return Promise.all(loadResults);
    }

    private needToLoad(item: LazyLoadItem): boolean {
        const lazyArray: Array<any> = item.source[item.property];
        if (lazyArray == null) {
            return true;
        } else if (item.expandTree != null && lazyArray.length > 0) {
            return LazyLoadTreeHelper.checkOneBranch(lazyArray, item.expandTree);
        } else {
            return false;
        }
    }

    public batchLoad(request: LazyLoadItemsRequest): Promise<Array<any>> {
        let i = request.lazyLoadItems.length;
        while (i--) {
            if (!this.needToLoad(request.lazyLoadItems[i])) {
                request.lazyLoadItems.splice(i, 1);
            }
        }
        if (request.lazyLoadItems.length > 0) {
            return this._lazyLoadService.batchLazyLoad(request);
        } else {
            return Promise.resolve([]);
        }
    }
}

export class LazyLoadItemsRequest {
    private _lazyLoadItems: Array<LazyLoadItem> = [];

    public addLazyLoadItems(
        source: BaseDTO,
        properties: Array<string>,
        expandTree: NTree<string> = null,
        loadAllTree: boolean = false
    ): void {
        properties.forEach(property => {
            this.addLazyLoadItem(source, property, expandTree, loadAllTree);
        });
    }

    public addLazyLoadItem(
        source: BaseDTO,
        property: string,
        expandTree: NTree<string> = null,
        loadAllTree: boolean = false
    ): void {
        this._lazyLoadItems.push(
            new LazyLoadItem(source, this.prepareLazyLoadProperty(property), expandTree, loadAllTree)
        );
    }

    public get lazyLoadItems(): Array<LazyLoadItem> {
        return this._lazyLoadItems;
    }

    private prepareLazyLoadProperty(properties: string): string {
        return `${properties}_LazyLoad`;
        /*
        return properties.map(prop => {
			return `${prop}_LazyLoad`;
		})
        */
    }
}

export class LazyLoadItem {
    public source: BaseDTO;

    public property: string;

    public expandTree: NTree<string>;

    public loadAllTree: boolean;

    constructor(source: BaseDTO, property: string, expandTree: NTree<string>, loadAllTree: boolean) {
        this.source = source;
        this.property = property;
        this.expandTree = expandTree;
        this.loadAllTree = loadAllTree;
    }
}
