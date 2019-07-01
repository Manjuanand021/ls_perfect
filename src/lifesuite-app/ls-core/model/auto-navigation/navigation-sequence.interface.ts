import { NavigationTarget } from './navigation-target';

/**
 * Navigation sequence stores set of navigation targets
 * that define navigation path for auto-navigation
 *
 */
export interface INavigationSequence {
    /**
     * Adds navigation target to the navigation sequence
     * @param item - navigation target
     * @return added navigation target object
     *
     */
    addNavigationTarget(item: NavigationTarget): NavigationTarget;

    /**
     * Returns clone of navigation sequence
     * @return cloned NavigationSequence object
     *
     */
    clone(): INavigationSequence;

    /**
     * Returns next navigation target from the navigation sequence
     * @return navigation target
     *
     */
    getNextNavigationTarget(): NavigationTarget;

    /**
     * Length of navigation sequence
     * @return length value
     *
     */
    readonly length: number;

    /**
     * Removes navigation target from navigation sequence
     * @param item - navigation target object to remove
     *
     */
    removeNavigationTarget(item: NavigationTarget): void;
}
