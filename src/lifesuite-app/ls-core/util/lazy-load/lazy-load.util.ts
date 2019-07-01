export const LazyName = '_LazyLoad';

export class LazyLoadUtil {
    public static isLazyLoadProperty(propertyName: string): boolean {
        return propertyName.search(LazyName) != -1;
    }

    public static getLazyPropertyName(propertyName: string): string {
        return propertyName.slice(0, propertyName.indexOf(LazyName));
    }

    public static compareLazyLoadTrees(source: Object, target: Object): void {
        Object.keys(source).forEach(key => {
            if (this.isLazyLoadProperty(key)) {
                const sourceArray: Array<any> = source[key];
                const targetArray: Array<any> = target[key];
                if (this.isConsistent(sourceArray, targetArray)) {
                    if (sourceArray && sourceArray.length > 0) {
                        for (let i = 0; i < sourceArray.length; i++) {
                            this.compareLazyLoadTrees(sourceArray[i], targetArray[i]);
                        }
                    }
                } else {
                    throw new Error(`Source and Target Lazyload collection: ${key} doesn't match!`);
                }
            }
        });
    }

    private static isConsistent(sourceArray: Array<any>, targetArray: Array<any>): boolean {
        if (
            (!sourceArray && !targetArray) ||
            (sourceArray && targetArray && sourceArray.length == targetArray.length)
        ) {
            return true;
        }
        return false;
    }
}
