import { ActivatedRouteSnapshot, RouteReuseStrategy, DetachedRouteHandle, Params } from '@angular/router';

/**
 *  The default Angular RouteReuseStrategy considers routes
 *  with the same path but different params to be equal.
 *  This class implements custom RouteReuseStrategy for such routes,
 *  requiring Angular to reload route's component.
 *  Such strategy is required, for example, with tabbed interface for tab-related routes,
 *  when multiple tabs are opened using the same component class.
 *  For example:
 *   	 some-route/1 -> some-route/2, or
 *		 some-route/1/child-route/11 -> some-route/2/child-route/22
 */
export class CustomRouteReuseStrategy implements RouteReuseStrategy {
    // handlers: { [key: string]: DetachedRouteHandle } = {};

    public shouldDetach(route: ActivatedRouteSnapshot): boolean {
        // console.debug('CustomReuseStrategy: shouldDetach', route);
        return false;
    }

    public store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
        // console.debug('CustomReuseStrategy: store', route, handle);
        // this.handlers[route.routeConfig.path] = handle;
    }

    public shouldAttach(route: ActivatedRouteSnapshot): boolean {
        // console.debug('CustomReuseStrategy: shouldAttach', route);
        // return !!route.routeConfig && !!this.handlers[route.routeConfig.path];
        return false;
    }

    public retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
        // console.debug('CustomReuseStrategy: retrieve', route);
        // if (!route.routeConfig) return null;
        // return this.handlers[route.routeConfig.path];
        return null;
    }

    public shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        // console.debug('CustomReuseStrategy: shouldReuseRoute', curr, future);
        return future.routeConfig === curr.routeConfig && this.routeParamsEqual(future.params, curr.params);
    }

    private routeParamsEqual(futureParams: Params, currParams: Params): boolean {
        for (const key in futureParams) {
            if (futureParams[key] !== currParams[key]) {
                return false;
            }
        }
        return true;
    }
}
