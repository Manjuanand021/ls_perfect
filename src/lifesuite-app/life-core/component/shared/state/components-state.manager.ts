import { Injectable, QueryList } from '@angular/core';

import { TabStateManager, TabStateValueAccessor, TabDataKeys } from 'life-core/util/tab-state';
import { Logger, ILogger } from 'life-core/logging';
import { ComponentState, ComponentsState } from './component-state-types';
import { StatefulComponent } from './stateful-component';

@Injectable()
export class ComponentsStateManager {
    private _componentsStateValueAccessor: TabStateValueAccessor<ComponentsState>;
    private _logger: ILogger;

    constructor(tabStateManager: TabStateManager, logger: Logger) {
        this._componentsStateValueAccessor = new TabStateValueAccessor<ComponentsState>(
            tabStateManager,
            TabDataKeys.VISUAL_COMPONENTS_STATE
        );
        this._logger = logger;
    }

    public getAllComponentsState(): ComponentsState {
        return this._componentsStateValueAccessor.getValue() || new Map<string, ComponentState>();
    }

    public saveComponentsState(components: QueryList<StatefulComponent>): void {
        const states = this.getAllComponentsState();
        components.forEach(component => {
            states.set(component.stateId, component.state);
        });
        this._componentsStateValueAccessor.setValue(states);
    }

    // This method is not used for now, because components in QueryList
    // are not available until they are visible, which is too late to restore the state.
    // Instead, each component binds to its own state using states collection
    // made available in each ViewModel.
    public restoreComponentsState(components: QueryList<StatefulComponent>): void {
        const states = this.getAllComponentsState();
        components.forEach(component => {
            if (states.has(component.stateId)) {
                component.state = states.get(component.stateId);
                states.delete(component.stateId);
            }
        });
    }

    public deleteComponentsState(components: QueryList<StatefulComponent>): void {
        if (components && components.length > 0) {
            const states = this.getAllComponentsState();
            components.forEach(component => {
                if (states.has(component.stateId)) {
                    states.delete(component.stateId);
                }
            });
        }
    }

    // public trackComponentsState(components: QueryList<StatefulComponent>): void {
    //     if (components && components.length > 0) {
    //         components.changes.subscribe(changes => {
    //             this._logger.log('trackComponentsState changes:', changes);
    //         });
    //     }
    // }
}
