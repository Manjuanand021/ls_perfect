import { MetadataItem, CodeHolderDTO } from 'ls-core/model';
import { ListItem } from 'life-core/model';

export class MetadataUtil {
    /**
     * From a list of metadata items, get the external code of a metadata item specified by its value
     */

    public static getExtCodeByValue(metadataList: Array<MetadataItem>, value: string): string {
        if (metadataList == null) return null;
        const metadataItem = metadataList.find(item => {
            return item.value == value;
        });
        return metadataItem ? metadataItem.externalCode : null;
    }

    /**
     * From a list of metadata items, get the value of a metadata item specified by its ExternalCode
     */

    public static getValueByExternalCode(metadataList: Array<MetadataItem>, externalCode: string): string {
        if (metadataList == null) return null;
        const metadataItem = metadataList.find(item => {
            return item.externalCode == externalCode;
        });
        return metadataItem ? metadataItem.value : null;
    }

    /**
     * From a list of metadata items, get the metadata item specified by its externalCode and return CodeHolderDTO
     */
    public static getItemByExternalCode(metadataList: Array<MetadataItem>, externalCode: string): CodeHolderDTO {
        if (metadataList == null) return null;
        const metadataItem = metadataList.find(item => {
            return item.externalCode == externalCode;
        });
        let codeHolderDTO: CodeHolderDTO;
        if (metadataItem) {
            codeHolderDTO = new CodeHolderDTO();
            codeHolderDTO.CodeId = metadataItem.value;
            codeHolderDTO.CodeValue = metadataItem.label;
        }
        return codeHolderDTO;
    }

    public static getItemByCode(list: Array<ListItem>, id: string): CodeHolderDTO {
        if (list == null) return null;
        const item = list.find(item => {
            return item.value == id;
        });
        const codeHolderDTO = new CodeHolderDTO();
        if (item) {
            codeHolderDTO.CodeId = item.value;
            codeHolderDTO.CodeValue = item.label;
        }
        return codeHolderDTO;
    }

    public static getLabelByValue(metadataList: Array<MetadataItem>, value: string): string {
        if (metadataList == null) return null;
        const item = metadataList.find(item => {
            return item.value == value;
        });
        return item ? item.label : '';
    }

    public static getItemCodeByLabel(list: Array<ListItem>, id: string): string {
        const codeHolderDTO: CodeHolderDTO = this.getItemByCode(list, id);
        return codeHolderDTO.CodeId;
    }

    public static getItemLabelByCode(list: Array<ListItem>, id: string): string {
        const codeHolderDTO = this.getItemByCode(list, id);
        return codeHolderDTO.CodeValue;
    }
}
