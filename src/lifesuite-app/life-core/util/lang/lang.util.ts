const _hasOwnProperty = Object.prototype.hasOwnProperty;

export class LangUtil {
    public static has(obj: any, prop: any): boolean {
        return _hasOwnProperty.call(obj, prop);
    }

    /**
     * Checks if the given argument is a function.
     * @function
     */
    public static isFunction(func: any): boolean {
        return typeof func === 'function';
    }

    /**
     * Checks if the given argument is undefined.
     * @function
     */
    public static isUndefined(obj: any): boolean {
        return typeof obj === 'undefined';
    }

    /**
     * Checks if the given argument is defined.
     * @function
     */
    public static isDefined(value: any): boolean {
        return value !== undefined && value !== null;
    }

    /**
     * Checks if the given argument is a string.
     * @function
     */
    public static isString(obj: any): obj is String {
        return typeof obj === 'string' || obj instanceof String;
    }

    /**
     * Checks if the given argument is an array.
     * @function
     */
    public static isArray(obj: any): boolean {
        return obj && Array.isArray(obj);
    }

    /**
     * Checks if the given argument is a object.
     * @function
     */
    public static isObject(obj: any): boolean {
        // Handle false positive (typeof null) returning 'object';
        return typeof obj === 'object' && obj !== null;
    }

    /**
     * Checks if the given argument is an array of objects.
     * @function
     */
    public static isArrayOfObjects(value: any): boolean {
        return Object.prototype.toString.apply(value) === '[object Array]';
    }

    /**
     * Checks if the given argument is a Date.
     * @function
     */
    public static isDate(obj: any): obj is Date {
        return obj instanceof Date && typeof obj.getMonth === 'function';
    }

    /**
     * Checks if the given argument is a Number.
     * @function
     */
    public static isNumber(value: any): value is Number {
        return typeof value == 'number'; // Boolean
    }

    /**
     * Checks if the given argument is null or empty string.
     * @function
     */
    public static isNullOrEmptyString(value: any): boolean {
        return value === null || value === '' || value === undefined; // Boolean
    }

    /**
     * Checks if the given argument is a promise.
     * @function
     */
    public static isPromise(value: any): boolean {
        return typeof value.then === 'function';
    }
}
