import { Injectable } from '@angular/core';

import { CacheManager, CacheItem } from 'life-core/cache';
import { FieldConfig } from 'life-core/component/dynamic-form';
import { FormLoadFieldsConfigService } from '../service/form-load-fields-config.service';

/**
 *  DynamicFormFieldsManager manages dynamic form fields
 */
@Injectable({
    providedIn: 'root'
})
export class DynamicFormFieldsManager extends CacheManager<Array<FieldConfig>> {
    private _formLoadFieldsConfigService: FormLoadFieldsConfigService;

    constructor(formLoadFieldsConfigService: FormLoadFieldsConfigService) {
        super();
        this._formLoadFieldsConfigService = formLoadFieldsConfigService;
    }

    protected loadValues(keys: Array<string>): Promise<Array<FieldConfig[]>> {
        const results: Array<Promise<FieldConfig[]>> = [];
        keys.forEach(key => {
            const fieldsPromise = this._formLoadFieldsConfigService.load(key);
            results.push(fieldsPromise);
        });
        return Promise.all(results);
    }

    public getFormFields(formType: string): Promise<CacheItem<Array<FieldConfig>>> {
        return this.getValueImpl(formType);
    }
}
