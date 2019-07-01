import { LangUtil } from './lang.util';

export class ConvertUtil {
    /**
     * Converts argument to number type.
     */
    public static toNumber(value: string | Object): number {
        if (LangUtil.isNumber(value)) {
            return value as number;
        }
        return value ? parseInt(value.toString()) : NaN;
    }
    /**
     * Converts argument to boolean type.
     */
    public static toBoolean(value: string | boolean | Object): boolean {
        if (value == null) return null;
        return value.toString().toLowerCase() == 'true' ? true : false;
    }
}
