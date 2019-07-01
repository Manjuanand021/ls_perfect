export class EnumUtil {
    /**
     * Checks if value exists in enum.
     * @Param enumType: enum to check.
     * @Param value: value to check.
     * @Returns boolean value
     */
    public static isValueInEnum(enumType: any, value: any): boolean {
        // Note: after switching to target "lib": [ES2017] in tsconfig.json,
        // this implementation could be replaced with
        //  return Object.values(enumType).includes(value)
        return (
            Object.keys(enumType)
                .filter(key => isNaN(Number(key)))
                .filter(key => enumType[key] === value).length > 0
        );
    }
}
