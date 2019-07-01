import { Injector } from '@angular/core';

import { DirectDataResolve, DirectResolvedData, DirectDataResolverClass } from './direct-resolve.interface';
import { Logger } from 'life-core/logging';
import { LangUtil } from 'life-core/util/lang';

export function resolveData(resolve: Array<DirectDataResolve>, injector: Injector): Promise<DirectResolvedData> {
    const resolveResults: Promise<void>[] = [];
    for (const resolveItem of resolve) {
        const resolveClass = resolveItem.resolverClass;
        const dataResolver = injector.get(resolveClass, null);
        if (dataResolver) {
            dataResolver.context = resolveItem.context;
            resolveResults.push(resolveDataImpl(dataResolver));
        } else {
            const logger = injector.get(Logger);
            logger.warn(`resolveData(): No provider for Resolver: ${resolveClass.name}`);
        }
    }
    return Promise.all(resolveResults).then(resolvedData => {
        return getResolvedDataMap(resolve, resolvedData);
    });
}

function resolveDataImpl(dataResolver: DirectDataResolverClass<any>): Promise<any> {
    if (LangUtil.isPromise(<any>dataResolver.directResolve)) {
        return (dataResolver.directResolve() as Promise<any>).then(() => {
            dataResolver.context = undefined;
        });
    } else {
        const result = dataResolver.directResolve();
        dataResolver.context = undefined;
        return Promise.resolve(result);
    }
}

function getResolvedDataMap(resolve: Array<DirectDataResolve>, resolvedData: Array<any>): DirectResolvedData {
    resolve.forEach((resolveItem, index) => {
        resolvedData[resolveItem.resolveName] = resolvedData[index];
    });
    return resolvedData;
}
