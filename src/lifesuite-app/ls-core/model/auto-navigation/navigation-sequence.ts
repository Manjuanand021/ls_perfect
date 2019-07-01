import { INavigationSequence } from './navigation-sequence.interface';
import { NavigationTarget } from './navigation-target';

export class NavigationSequence implements INavigationSequence {
    private _navigationTargets: NavigationTarget[];

    constructor() {
        this._navigationTargets = [];
    }

    public addNavigationTarget(item: NavigationTarget): NavigationTarget {
        this._navigationTargets.push(item);
        return item;
    }

    /**
     * Returns clone of navigation sequence
     * @return cloned NavigationSequence object
     *
     */
    public clone(): INavigationSequence {
        const sequence = new NavigationSequence();
        sequence._navigationTargets = [...this._navigationTargets];
        return sequence;
    }

    /**
     * Returns next navigation target from the navigation sequence
     * @return navigation target
     *
     */
    public getNextNavigationTarget(): NavigationTarget {
        return this._navigationTargets.length > 0 ? this._navigationTargets[0] : null;
    }

    /**
     * Length of navigation sequence
     * @return length value
     *
     */
    public get length(): number {
        return this._navigationTargets.length;
    }

    /**
     * Removes navigation target from navigation sequence
     * @param item - navigation target object to remove
     *
     */
    public removeNavigationTarget(item: NavigationTarget): void {
        const removeIndex = this._navigationTargets.findIndex(target => target.navigatorId === item.navigatorId);
        this._navigationTargets.splice(removeIndex, 1);
    }
}
