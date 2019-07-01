/**
 * Keeps state of one component
 */
export type ComponentState = Map<string, any>;

/**
 * Keeps state of a group of components
 */
export type ComponentsState = Map<string, ComponentState>;
