export enum CompareResult {
    greater = 1,
    equal = 0,
    less = -1
}

export function compare<T>(value1: T, value2: T): CompareResult {
    return value1 > value2 ? CompareResult.greater : value1 < value2 ? CompareResult.less : CompareResult.equal;
}
