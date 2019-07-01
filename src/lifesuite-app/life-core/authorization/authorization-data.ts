import { AuthorizationLevel, ComponentAuthorizationLevelMap } from './authorization-level';

/**
 * Describes Authorization data for ViewModel
 */
export class AuthorizationData {
    public defaultLevel: AuthorizationLevel;
    public componentLevel: ComponentAuthorizationLevelMap;

    constructor(defaultLevel: AuthorizationLevel, componentLevel: ComponentAuthorizationLevelMap = {}) {
        this.defaultLevel = defaultLevel;
        this.componentLevel = componentLevel;
    }

    public getLevel(componentName?: string): AuthorizationLevel {
        return componentName !== undefined && this.hasComponentLevel(componentName)
            ? this.componentLevel[componentName]
            : this.defaultLevel;
    }

    public hasComponentLevel(componentName: string): boolean {
        return this.componentLevel.hasOwnProperty(componentName);
    }

    public clone(): AuthorizationData {
        return new AuthorizationData(this.defaultLevel, { ...this.componentLevel });
    }
}
