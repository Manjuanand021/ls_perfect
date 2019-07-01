import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';

/**
 * Alias for interface Resolve to clarify its usage.
 * RouteResolve interface implemented by route-based resolvers.
 */
export type RouteResolve<T> = Resolve<T>;

/**
 * DirectResolve interface.
 *
 * DirectResolve interface implemented by non-route-based resolvers.
 * Should be implemented by resolvers passed to a component (e.g. Dialog)
 * as 'resolve' parameter to preload some data.
 */
export interface DirectResolve<T> {
    directResolve(): Observable<T> | Promise<T> | T;
}
