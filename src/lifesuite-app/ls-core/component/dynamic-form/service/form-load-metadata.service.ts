import { Injectable } from '@angular/core';

import { ListFieldConfig, ListFieldConfigType } from 'life-core/component/dynamic-form';
import { MetadataLoader } from 'ls-core/util';
import { BaseFormLoadListFieldsService } from './base-form-load-listfields.service';

@Injectable({ providedIn: 'root' })
export class FormLoadMetadataService extends BaseFormLoadListFieldsService {
    private _metadataLoader: MetadataLoader;

    constructor(metadataLoader: MetadataLoader) {
        super();
        this._metadataLoader = metadataLoader;
    }

    public load(listFields: Array<ListFieldConfig>): Promise<void> {
        if (listFields.length > 0) {
            const listMetaTypes = this.getListTypes(listFields);
            return this._metadataLoader.load(listMetaTypes).then(data => {
                this.updateListFieldOptions(listFields, data);
            });
        } else {
            return Promise.resolve();
        }
    }

    protected get listTypeProperty(): ListFieldConfigType {
        return ListFieldConfigType.MetaType;
    }
}
