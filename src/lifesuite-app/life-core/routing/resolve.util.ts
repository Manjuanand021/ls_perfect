import { ResolveData } from '@angular/router';

/**
 *  Provides helper methods related to resolver objects in routing tables.
 */
export class ResolveUtil {
    /**
     *  Joins multiple resolver objects into a single ResolveData object.
     */
    public static joinResolvers(resolvers: Array<ResolveData>): ResolveData {
        return Object.assign({}, ...resolvers);
    }
}
