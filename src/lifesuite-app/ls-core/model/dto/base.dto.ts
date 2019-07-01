import { IIdentifiable, Identifiable } from './identifiable';
import { LazyLoadEvent } from 'ls-core/service/lazy-load';

export class BaseDTO implements IIdentifiable {
    // public eventEmitterLazyLoadStarted: EventEmitter<LazyLoadEvent> = new EventEmitter<LazyLoadEvent>();
    // public eventEmitterLazyLoadFinished: EventEmitter<LazyLoadEvent> = new EventEmitter<LazyLoadEvent>();

    public _lazyLoadEnabled: boolean;
    /**
     * List of lazyLoaded Properties that is already loaded.
     */
    private _propertyLoaded: Map<string, boolean>;

    constructor() {
        this._lazyLoadEnabled = false;
    }

    public disableLazyLoad(): void {
        this._lazyLoadEnabled = false;
    }

    public enableLazyLoad(): void {
        this._lazyLoadEnabled = true;
    }

    public isLazyLoadEnabled(): boolean {
        return this._lazyLoadEnabled;
    }

    public getIdentifier(): Identifiable {
        return null;
    }

    public identifier: Identifiable;

    public getIdentifierTreeBranchToCurrentObject(currentIdentifier: Identifiable): Identifiable {
        if (currentIdentifier == null) {
            return null;
        }
        let treeTraveler: Identifiable;
        currentIdentifier.ChildIdentifier = null;
        treeTraveler = currentIdentifier;
        while (treeTraveler.ParentIdentifier) {
            treeTraveler.ParentIdentifier.ChildIdentifier = treeTraveler;
            treeTraveler = treeTraveler.ParentIdentifier;
        }
        return treeTraveler;
    }

    protected linkChildrenIdentifiersToParent(currentIdentifier: Identifiable, childObjs: Array<IIdentifiable>): void {
        let childIdentifier: Identifiable;
        if (childObjs == null) {
            return;
        }
        childObjs.forEach(childObj => {
            childIdentifier = childObj.identifier;
            // childIdentifier = childObj.getIdentifier();
            if (childIdentifier) {
                childIdentifier.ParentIdentifier = currentIdentifier;
            }
        });
    }

    protected linkChildIdentifierToParent(currentIdentifier: Identifiable, childObj: IIdentifiable): void {
        let childIdentifier: Identifiable;
        if (childObj == null) {
            return;
        }
        childIdentifier = childObj.identifier;
        // childIdentifier = childObj.getIdentifier();
        if (childIdentifier) {
            childIdentifier.ParentIdentifier = currentIdentifier;
        }
    }

    public recordLazyLoadedProperty(propertyName: string): void {
        this.getPropertyLoadedMap().set(propertyName, true);
    }

    private getPropertyLoadedMap(): Map<string, boolean> {
        if (!this._propertyLoaded) {
            this._propertyLoaded = new Map<string, boolean>();
        }
        return this._propertyLoaded;
    }

    private isPropertyLoadedAlready(propertyName: string): boolean {
        return (
            this._propertyLoaded != undefined &&
            this._propertyLoaded.has(propertyName) &&
            this._propertyLoaded.get(propertyName)
        );
    }
}
