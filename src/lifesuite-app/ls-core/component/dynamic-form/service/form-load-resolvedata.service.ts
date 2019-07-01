import { Injector, Injectable } from '@angular/core';

import { ListFieldConfig, ListFieldConfigType } from 'life-core/component/dynamic-form';
import { DirectDataResolve, resolveData } from 'life-core/component/shared';
import { BaseFormLoadListFieldsService } from './base-form-load-listfields.service';

@Injectable({ providedIn: 'root' })
export class FormLoadResolveDataService extends BaseFormLoadListFieldsService {
    private _injector: Injector;

    constructor(injector: Injector) {
        super();
        this._injector = injector;
    }

    public load(listFields: Array<ListFieldConfig>, resolves: Array<DirectDataResolve>): Promise<void> {
        if (listFields.length > 0 && resolves) {
            const applicableResolves = this.getApplicableResolves(listFields, resolves);
            return resolveData(applicableResolves, this._injector).then(data => {
                this.updateListFieldOptions(listFields, data);
            });
        } else {
            return Promise.resolve();
        }
    }

    private getApplicableResolves(
        listFields: Array<ListFieldConfig>,
        resolve: Array<DirectDataResolve>
    ): Array<DirectDataResolve> {
        return resolve.filter(
            resolveItem => listFields.findIndex(field => field.resolveType == resolveItem.resolveName) >= 0
        );
    }

    protected get listTypeProperty(): ListFieldConfigType {
        return ListFieldConfigType.ResolveType;
    }
}
