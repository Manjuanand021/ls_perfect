/**
 * Authorization levels
 */
export const enum AuthorizationLevel {
    NONE = 0,
    VIEW = 1,
    EDIT = 2
}

/**
 * Maps components to authorization levels
 * Allows to setup different authorization levels components
 */
export type ComponentAuthorizationLevelMap = { [componentName: string]: AuthorizationLevel };
