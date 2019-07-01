import { ComponentState } from './component-state-types';

/**
 * Implement IStatefulComponent interface for components
 * that need to preserve/restore state.
 * This is needed, for example, when user switches between tabs and
 * we want to display components in the same visual state they were before.
 */
export interface IStatefulComponent {
    stateId: string;
    state: ComponentState;
}

/**
 * Dummy stateful component class;
 * Required to provide a standard DI registration of all stateful components.
 */
export class StatefulComponent implements IStatefulComponent {
    public stateId: string;

    public state: ComponentState;
}
