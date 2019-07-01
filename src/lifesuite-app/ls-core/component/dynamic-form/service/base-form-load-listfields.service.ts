import { ListFieldConfig, ListFieldConfigType } from 'life-core/component/dynamic-form';

export abstract class BaseFormLoadListFieldsService {
    protected abstract get listTypeProperty(): ListFieldConfigType;

    protected getListTypes(listFields: Array<ListFieldConfig>, data?: any): Array<string> {
        return listFields.map(field => {
            return this.getListType(field, data);
        });
    }

    protected getListType(listField: ListFieldConfig, data?: any): ListFieldConfigType | string {
        return listField[this.listTypeProperty as string];
    }

    protected updateListFieldOptions(
        listFields: Array<ListFieldConfig>,
        optionsMap: { readonly [key: string]: Array<any> },
        data?: any
    ): void {
        listFields.forEach(field => {
            field.options = optionsMap[this.getListType(field, data)];
        });
    }
}
