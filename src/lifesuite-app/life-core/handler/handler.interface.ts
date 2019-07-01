/**
 * Common interface for action handlers
 */
export interface IActionHandler {
    execute(actionParams?: any): void;
}
