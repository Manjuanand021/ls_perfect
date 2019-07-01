import { AuthorizationData } from './authorization-data';
import { AuthorizationLevel } from './authorization-level';

export abstract class AuthorizationProvider {
    protected authorizationData: AuthorizationData;
    protected parentAuthorizationProvider: AuthorizationProvider;
    protected authorizationProviderHost: AuthorizationProviderHost;
    private _setupDone: boolean;

    constructor(parentAuthProvider: AuthorizationProvider) {
        this.parentAuthorizationProvider = parentAuthProvider;
        this.initialize();
    }

    public getAuthorizationData(): AuthorizationData {
        if (!this._setupDone) {
            this.setup();
            this._setupDone = true;
        }
        return this.authorizationData.clone();
    }

    /**
     * Returns parent's default/component authorization level for given component name
     */
    public getParentAuthorizationLevel(componentName: string): AuthorizationLevel {
        const parentAuthorizationData = this.parentAuthorizationProvider.getAuthorizationData();
        return parentAuthorizationData.getLevel(componentName);
    }

    private initialize(): void {
        const parentDefaultLevel = this.parentAuthorizationProvider
            ? this.parentAuthorizationProvider.getAuthorizationData().defaultLevel
            : AuthorizationLevel.EDIT;
        this.authorizationData = new AuthorizationData(parentDefaultLevel);
    }

    /**
     * Setup Authorization data for AuthorizationProvider's component
     */
    protected setup(): void {}
}

export interface IAuthorizationProviderHost {
    getAuthorizationProviderContext(): any;
}

export abstract class AuthorizationProviderHost implements IAuthorizationProviderHost {
    public abstract getAuthorizationProviderContext(): any;
}
