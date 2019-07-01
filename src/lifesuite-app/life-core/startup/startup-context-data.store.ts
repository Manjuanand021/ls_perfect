import { StartupContext } from './startup-context.model';

export class StartupContextDataStore {
    private _contextData: StartupContext;

    private _resolvedDataProperties: string[] = [];

    public getData(): StartupContext {
        return this._contextData;
    }

    public setData(data: StartupContext): void {
        this._contextData = data;
    }

    public isPropertyResolved(propertyName: string): boolean {
        return this._resolvedDataProperties.find(prop => prop == propertyName) != undefined;
    }

    public setResolvedProperties(properties: string[]): void {
        properties.forEach(property => {
            if (!this.isPropertyResolved(property)) {
                this._resolvedDataProperties.push(property);
            } else {
                throw new Error(`Context property ${property} has already been resolved.`);
            }
        });
    }

    public hasUnresolvedProperties(): boolean {
        if (this._contextData) {
            const allProperties = Object.keys(this._contextData);
            const unresolvedProperties = allProperties.filter(prop => {
                return this._resolvedDataProperties.find(resolvedProp => resolvedProp == prop) == undefined;
            });
            return unresolvedProperties.length > 0;
        } else {
            return false;
        }
    }
}
