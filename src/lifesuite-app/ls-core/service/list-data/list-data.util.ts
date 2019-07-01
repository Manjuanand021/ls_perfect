import { ListItem } from 'life-core/model';
import { ListDataItem } from './list-data.model';
import { MetadataItem } from 'ls-core/model';

export class ListDataUtil {
    /**
     * From array of ListDataItem items, get the value of a item specified by its Id
     */
    public static getValueFromListDataById(listData: Array<ListDataItem>, id: string): string {
        const listDataItem = listData.find(item => {
            return item.Id == id;
        });
        return listDataItem ? listDataItem.value : null;
    }

    /**
     * From array of ListDataItem items, get the label of a item specified by its Id
     */

    public static getLabelFromListDataById(listData: Array<any>, id: string): string {
        const listDataItem = listData.find(item => {
            return item.value == id;
        });
        return listDataItem ? listDataItem.label : null;
    }

    /**
     * Add an item to the ListDataItem.
     */
    public static addListDataItem(
        listData: Array<ListDataItem>,
        itemID: string = '',
        itemValue: string = '',
        externalCode: string = ''
    ): void {
        let item = listData.find(item => {
            return item.Id === itemID;
        });
        if (item != null) return;
        item = new ListDataItem(itemID, itemValue, externalCode);
        listData.push(item);
    }

    /**
     * From array of ListDataItem items, get the externalCode of a item specified by its Id
     */
    public static getExternalCodeFromListDataById(listData: Array<ListDataItem>, id: string): string {
        const listDataItem = listData.find(item => {
            return item.Id == id;
        });
        return listDataItem ? listDataItem.externalCode : null;
    }

    /**
     * From array of ListDataItem items, get the Id of a item specified by its externalCode
     */
    public static getIdFromListDataByExternalCode(listData: Array<ListDataItem>, externalCode: string): string {
        const listDataItem = listData.find(item => {
            return item.externalCode == externalCode;
        });
        return listDataItem ? listDataItem.Id : null;
    }

    /**
     * Convert array of ListDataItem items to array of ListItem items.
     */
    public static convertToListItemArray(listData: Array<ListDataItem>): Array<ListItem> {
        return listData.map(item => {
            return new ListItem(item.value, item.Id);
        });
    }

    /**
     * Convert array of MetaDataItem items to array of ListDataItem items.
     */
    public static convertToListDataItemArray(listData: Array<MetadataItem>): Array<ListDataItem> {
        return listData.map(item => {
            return new ListDataItem(item.value, item.label ,item.externalCode);
        });
    }

    /**
     * Convert array of MetaDataItem items to array of ListItem items.
     */
    public static convertToListItemsFromMetadataItems(listData: Array<MetadataItem>): Array<ListItem> {
        return listData.map(item => {
            return new ListItem(item.label, item.value);
        });
    }

    /**
     * Returns the default index or "0"th index ListDataItem value
     * @param listData
     * @param defaultIndex
     */
    public static getFirstOrDefaultListItemValue(listData: Array<ListDataItem>, defaultIndex?: number): string {
        return (listData && listData.length) > 0 ? listData[defaultIndex ? defaultIndex : 0].value : '';
    }
}
