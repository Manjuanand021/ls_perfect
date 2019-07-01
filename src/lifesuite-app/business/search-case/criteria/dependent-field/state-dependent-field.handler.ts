import { Injectable } from '@angular/core';

import {
    DependentFieldHandler,
    DependentFieldHandlerContext,
    ListFieldConfig,
    FormListFieldsUtil
} from 'life-core/component/dynamic-form';
import { FormLoadDynamicMetadataService } from 'ls-core/component/dynamic-form';
import { SearchFormData } from '../search-form-data.builder';

const countryMetaTypeMap: { readonly [key: string]: string } = {
    USA: 'country_state_usa',
    CANADA: 'country_state_canada'
};

@Injectable()
export class StateDependentFieldHandler extends DependentFieldHandler {
    private _context: DependentFieldHandlerContext;
    private _formLoadDynamicMetadataService: FormLoadDynamicMetadataService;

    constructor(formLoadDynamicMetadataService: FormLoadDynamicMetadataService) {
        super();
        this._formLoadDynamicMetadataService = formLoadDynamicMetadataService;
    }

    public execute(context: DependentFieldHandlerContext): void {
        this._context = context;
        this.setStateFieldMetaType();
        this.preprocessFormFields();
    }

    private setStateFieldMetaType(): void {
        const searchFormData = this._context.formData as SearchFormData;
        (this._context.dependentField as ListFieldConfig).metaType =
            countryMetaTypeMap[searchFormData.policy.CountryId] || '';
    }

    private preprocessFormFields(): Promise<void> {
        const listFieldsWithDynamicMetaType = FormListFieldsUtil.getListFieldsWithDynamicMetaType(
            this._context.formFields
        );
        return this._formLoadDynamicMetadataService.load(listFieldsWithDynamicMetaType, this._context.formData);
    }
}
