import { ListUtil } from 'life-core/util';
import { ListItem } from 'life-core/model';
import { MetadataUtil } from 'ls-core/util';

export class BeneficiaryUtil {
    public static convertToDropdownListAndGetLabel(itemList: Array<any>, value: string): string {
        const dropdownList: ListItem[] = ListUtil.convertToListItems(itemList);
        return ListUtil.getLabelByValue(dropdownList, value);
    }

     public static getLabelFromExternalCode(itemList: Array<any>, value: string): string {
        
        return MetadataUtil.getValueByExternalCode(itemList, value);
    }
}
