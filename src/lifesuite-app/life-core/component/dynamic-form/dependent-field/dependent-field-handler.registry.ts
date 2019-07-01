import { Type } from '@angular/core';

import { DependentFieldHandler } from './dependent-field.handler';

export type DependentFieldHandlerRegistryItem = {
    handlerClass: Type<DependentFieldHandler>;
    additionalContext?: any[];
};

export class DependentFieldHandlerRegistry {
    // Map of dependent field handlers
    private _registry: Map<string, DependentFieldHandlerRegistryItem> = new Map();

    public get(fieldName: string): DependentFieldHandlerRegistryItem {
        return this._registry.get(fieldName);
    }

    public set(fieldName: string, handlerClassType: Type<DependentFieldHandler>, additionalContext?: any[]): void {
        this._registry.set(fieldName, {
            handlerClass: handlerClassType,
            additionalContext: additionalContext
        } as DependentFieldHandlerRegistryItem);
    }

    public destroy(): void {
        this._registry.clear();
    }
}
