import { LangUtil } from './lang.util';

const cloneDeep = require('lodash.cloneDeep');

/**
 * Interface for a parameterless constructor for a Object.
 */
export interface IDefaultConstructor<T> {
    new (): T;
}

/**
 * Interface of a constructor with parameters for a Object.
 */
export interface IParameterConstructor<T> {
    new (...args: any[]): T;
}

export class ObjectUtil {
    /**
     * Copies existing object to a new object of generic type T.
     */
    public static copy<T>(from: Object, type: IDefaultConstructor<T>): T;
    public static copy<T>(from: Object, type: IParameterConstructor<T>, args: any[]): T;
    public static copy<T>(from: Object, type: IParameterConstructor<T>, args?: any[]): T {
        const to: T = ObjectUtil.create(type, args);
        for (const key in from) {
            to[key] = from[key];
        }
        return to;
    }

    /**
     * Returns new instance of generic type T.
     */
    public static create<T>(type: IDefaultConstructor<T>): T;
    public static create<T>(type: IParameterConstructor<T>, args: any[]): T;
    public static create<T>(type: IParameterConstructor<T>, args?: any[]): T {
        return new type(...args);
    }

    /**
     * Deep copies existing object to a new object.
     */
    public static deepCopy<T>(from: T): T {
        const to = cloneDeep(from);
        return to;
    }

    public static createObjectOfType<T>(object: Object, type: IDefaultConstructor<T>): T | T[] {
        if (LangUtil.isArray(object)) {
            return (object as Array<any>).map(item => {
                return ObjectUtil.copy(item, type);
            });
        } else {
            return ObjectUtil.copy(object, type);
        }
    }

    /**
     * Shallow copy property from one object to another object.
     */
    public static shallowCopy(from: Object, to: Object): void {
        Object.keys(from).forEach(key => (to[key] = from[key]));
    }
}
