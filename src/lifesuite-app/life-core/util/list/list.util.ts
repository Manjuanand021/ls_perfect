import { ListItem } from 'life-core/model';

export class ListUtil {
    /**
     * From array of ListItems, get the label of a ListIem specified by its value
     */
    public static getLabelByValue(list: Array<ListItem>, value: string): string {
        if (list == null) {
            return null;
        }
        const listItem = list.find(item => item.value == value);
        return listItem ? listItem.label : null;
    }

    /**
     * Add an empty item to the list of dropdown items.
     */
    public static addEmptyItem(
        dropdownList: Array<ListItem>,
        emptyItemlabel: string = '',
        emptyItemValue: string = null
    ): void {
        let emptyItem = dropdownList.find(item => {
            return item.label === emptyItemlabel && (item.value === emptyItemValue || item.value == '');
        });
        if (emptyItem != null) return;
        emptyItem = new ListItem(emptyItemlabel, emptyItemValue);
        dropdownList.unshift(emptyItem);
    }

    /**
     * Convert a list of items to a list of dropdown items.
     */
    public static convertToListItems(
        itemList: Array<any>,
        labelProperty: string = 'value',
        valueProperty: string = 'Id'
    ): Array<ListItem> {
        return itemList.map(item => {
            return new ListItem(item[labelProperty], item[valueProperty]);
        });
    }

    public static areEqual(list1: Array<ListItem>, list2: Array<ListItem>): boolean {
        if (list1 == null && list2 == null) return null;
        if (list1 == null || list2 == null || list1.length != list2.length) return false;
        const length = list1.length;
        for (let i = 0; i < length; i++) {
            if (!list1[i].equalTo(list2[i])) return false;
        }
        return true;
    }

    /**
     * Checks whether given value exist in dropdown list
     * @param list dropdown list
     * @param value value to be searched in dropdown list
     */
    public static isItemExist(list: Array<ListItem>, value: string): boolean {
        return !!(list !== undefined && list.find(item => item.value === value));
    }
}
