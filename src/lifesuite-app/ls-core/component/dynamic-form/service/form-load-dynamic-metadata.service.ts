import { Injectable } from '@angular/core';

import { ListFieldConfig, ListFieldConfigType } from 'life-core/component/dynamic-form';
import { MetadataLoader } from 'ls-core/util';
import { BaseFormLoadListFieldsService } from './base-form-load-listfields.service';

@Injectable({ providedIn: 'root' })
export class FormLoadDynamicMetadataService extends BaseFormLoadListFieldsService {
    private _metadataLoader: MetadataLoader;

    constructor(metadataLoader: MetadataLoader) {
        super();
        this._metadataLoader = metadataLoader;
    }

    public load(listFields: Array<ListFieldConfig>, formData: Object): Promise<void> {
        if (listFields.length > 0) {
            const listMetaTypes = this.getListTypes(listFields, formData);
            return this._metadataLoader.load(listMetaTypes).then(listOptions => {
                this.updateListFieldOptions(listFields, listOptions, formData);
            });
        } else {
            return Promise.resolve(null);
        }
    }

    protected get listTypeProperty(): ListFieldConfigType {
        return ListFieldConfigType.MetaType;
    }

    protected getListType(listField: ListFieldConfig, data?: any): string {
        return listField.getDynamicType(listField, data);
    }
}
