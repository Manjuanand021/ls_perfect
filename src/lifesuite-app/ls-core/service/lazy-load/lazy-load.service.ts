import { Injector, Injectable } from '@angular/core';

import { LazyLoadImpl } from './lazy-load.impl';
import { LazyLoadItem, LazyLoadItemsRequest } from 'ls-core/util';

/**
 * Preloads a set of lazy-loaded collections for one object.
 */
@Injectable()
export class LazyLoadService {
    // extends EventDispatcher

    private _injector: Injector;

    constructor(injector: Injector) {
        this._injector = injector;
    }

    public doLazyLoad(request: LazyLoadItem): Promise<any> {
        if (request.source) {
            const loader = new LazyLoadImpl(this._injector);
            return loader.load(request);
        }
    }

    public batchLazyLoad(requests: LazyLoadItemsRequest): Promise<any> {
        const loader = new LazyLoadImpl(this._injector);
        return loader.batchLoad(requests);
    }
}
