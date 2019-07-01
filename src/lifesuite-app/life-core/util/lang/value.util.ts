const _hasOwnProperty = Object.prototype.hasOwnProperty;

export class ValueUtil {
    public static getValueOrEmptyString(value: any): string {
        return value ? value : '';
    }
}
