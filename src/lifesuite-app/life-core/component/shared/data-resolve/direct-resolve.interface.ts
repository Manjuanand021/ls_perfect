import { Type } from '@angular/core';

import { DirectResolve } from 'life-core/view-model/data-resolver';

/**
 * Direct data resolver class interface.
 *
 * A class should implement this interface when it's passed to a component (e.g. Dialog)
 * as a 'resolve' parameter to preload some data.
 * (similar to Route.resolve)
 */
export interface DirectDataResolverClass<T> extends DirectResolve<T> {
    /**
     * Context object for the resolver,
     * for example current item when dialog opened inside MasterDetail
     */
    context?: any;
}

/**
 * Direct data resolve passed to a component, such as dialog.
 */
export interface DirectDataResolve {
    resolverClass: Type<DirectDataResolverClass<any>>;
    resolveName: string;
    context?: any;
}

/**
 * Result returned by data resolvers.
 */
export type DirectResolvedData = { [resolveName: string]: any };
