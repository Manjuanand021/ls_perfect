import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { DirectResolve, RouteResolve } from 'life-core/view-model/data-resolver';
import { Session } from 'life-core/session';
import { StartupContext } from './startup-context.model';

export abstract class BaseStartupContextResolver<T>
    implements RouteResolve<ContextResolverResult<T>>, DirectResolve<ContextResolverResult<T>> {
    protected startupContext: StartupContext;

    protected resolveError: string;

    constructor() {}

    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<ContextResolverResult<T>> {
        return this.restoreContextData();
    }

    public directResolve(): Promise<ContextResolverResult<T>> {
        return this.restoreContextData();
    }

    protected abstract get session(): Session;

    protected abstract restoreData(): T;

    protected abstract get resolvedContextProperties(): string[];

    protected abstract getContext(): Promise<StartupContext>;

    protected restoreContextData(): Promise<ContextResolverResult<T>> {
        return this.getContext().then(startupContext => {
            this.startupContext = startupContext;
            if (this.startupContext) {
                const result = this.restoreData();
                this.updateResolvedContextProperties();
                this.removeContextIfNotNeeded();
                return new ContextResolverResult<T>(true, result);
            } else {
                return new ContextResolverResult<T>(false, undefined, this.resolveError);
            }
        });
    }

    protected setContext(startupContext: StartupContext): void {
        this.session.startupContextDataStore.setData(startupContext);
    }

    private removeContextIfNotNeeded(): void {
        if (!this.contextHasExtraData()) {
            this.session.resetStartupContextData();
        }
    }

    private contextHasExtraData(): boolean {
        return this.session.startupContextDataStore.hasUnresolvedProperties();
    }

    private updateResolvedContextProperties(): void {
        this.session.startupContextDataStore.setResolvedProperties(this.resolvedContextProperties);
    }
}

export class ContextResolverResult<T> {
    public isResolved: boolean;
    public context: T;
    public resolveError: string;

    constructor(isResolved: boolean, context?: T, resolveError?: string) {
        this.isResolved = isResolved;
        this.context = context;
        this.resolveError = resolveError;
    }
}
