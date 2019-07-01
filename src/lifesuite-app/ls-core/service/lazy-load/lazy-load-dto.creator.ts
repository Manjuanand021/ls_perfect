import { BaseDTO, DataCollectionNameToDTOMap } from 'ls-core/model';
import { ObjectUtil } from 'life-core/util/lang';

export class LazyLoadDTOObjectCreator {
    public createFrom(data: Array<Object>, dataType: string): Array<BaseDTO> {
        const newData: Array<BaseDTO> = [];
        for (const dataItem of data) {
            newData.push(this.createItem(dataItem, dataType));
        }
        return newData;
    }

    private createItem(item: Object, dataType: string): BaseDTO {
        const classType = DataCollectionNameToDTOMap[dataType];
        if (!classType) {
            throw new Error(`Undefined LazyLoad data type: ${dataType}`);
        }
        return ObjectUtil.copy(item, DataCollectionNameToDTOMap[dataType]);
    }
}
