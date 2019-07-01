import { Type } from '@angular/core';
import { Resolve, ResolveData } from '@angular/router';

/**
 *  Provides helper methods to define
 *  specific resolver objects, such as data, listData, metaData, etc. in routing tables.
 */
export class LsResolveUtil {
    public static getDataResolver(resolver: Type<Resolve<any>>): ResolveData {
        return { data: resolver };
    }

    public static getListDataResolver(resolver: Type<Resolve<any>>): ResolveData {
        return { listData: resolver };
    }

    public static getMetaDataResolver(resolver: Type<Resolve<any>>): ResolveData {
        return { metaData: resolver };
    }
}
