export class ArrayUtil {
    /**
     * Creates Compare function to use with Array.sort() to sort based on the order in another(reference) array.
     * @Param sortAs: reference array providing desired order of items.
     * @Param sortPropertyName: property name to sort by.
     * @Returns Compare function
     * Usage:
     * 		const arr=[new ListItem('a','1'), new ListItem('b','2'), new ListItem('c','3')];
     *	    const sortAs = ['2', '3', '1'];
     *		arr.sort(ArrayUtil.getSortCompareFunction<ListItem>(sortAs, 'value')));
     */
    public static getSortCompareFunction<T>(
        sortAs: Array<number | string>,
        sortPropertyName: string
    ): (a: T, b: T) => number {
        return function sortFunc(a: T, b: T): number {
            return sortAs.indexOf(a[sortPropertyName]) - sortAs.indexOf(b[sortPropertyName]);
        };
    }

    /**
     * Join an array of objects by property
     */
    public static joinList(array: Array<any>, property: string, separator: string): string {
        if (!array || array.length == 0) return '';
        const propertyArray = array.map(element => {
            return element[property];
        });
        return propertyArray.join(separator);
    }

    /**
     * Add automatic ID to an array of items
     */
    public static addAutoItemId(items: Array<any>, idProperty: string): void {
        if (items && items.length > 0) {
            for (let i = 0, length = items.length; i < length; i++) {
                items[i][idProperty] = i + 1;
            }
        }
    }
}
