import { Injectable } from '@angular/core';

import { ListFieldConfig, ListFieldConfigType } from 'life-core/component/dynamic-form';
import { ListDataService, ListDataRequestBuilder, ListsDataRequest } from 'ls-core/service';
import { BaseFormLoadListFieldsService } from './base-form-load-listfields.service';
import { BaseDTO } from 'ls-core/model';

@Injectable({ providedIn: 'root' })
export class FormLoadListDataService extends BaseFormLoadListFieldsService {
    private _listDataService: ListDataService;

    constructor(listDataService: ListDataService) {
        super();
        this._listDataService = listDataService;
    }

    public load(listFields: Array<ListFieldConfig>, formData: Object, rootDTO: BaseDTO): Promise<void> {
        if (listFields.length > 0) {
            const request = this.getListsDataRequest(listFields, formData, rootDTO);
            return this._listDataService.load(request).then(data => {
                this.updateListFieldOptions(listFields, data);
            });
        } else {
            return Promise.resolve();
        }
    }

    private getListsDataRequest(
        listFields: Array<ListFieldConfig>,
        formData: Object,
        rootDTO: BaseDTO
    ): ListsDataRequest {
        const listDataRequestBuilder = new ListDataRequestBuilder();
        listDataRequestBuilder.setRootDTO(rootDTO);
        listFields.forEach(listField => {
            listDataRequestBuilder.addListRequestItem(formData[listField.dataPath], listField.listType);
        });

        return listDataRequestBuilder.getRequest();
    }

    protected get listTypeProperty(): ListFieldConfigType {
        return ListFieldConfigType.ListType;
    }
}
