export class ChangeDetectionUtil {
    /**
     * Suppress ExpressionChangedAfterItHasBeenCheckedError when needed
     */
    public static supressExpressionChangedError(func: Function): void {
        setTimeout(func, 0);
    }
}
