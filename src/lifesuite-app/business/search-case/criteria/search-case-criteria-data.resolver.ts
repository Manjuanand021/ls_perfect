import { Injector, Injectable } from '@angular/core';
import { BaseViewDataResolver } from 'ls-core/view-model';
import { SearchCaseCriteriaFieldsLoader } from './search-case-criteria-fields.loader';

@Injectable()
export class SearchCaseCriteriaDataResolver extends BaseViewDataResolver {
    private _searchCaseCriteriaFieldsLoader: SearchCaseCriteriaFieldsLoader;

    constructor(injector: Injector, searchCaseCriteriaFieldsLoader: SearchCaseCriteriaFieldsLoader) {
        super(injector);
        this._searchCaseCriteriaFieldsLoader = searchCaseCriteriaFieldsLoader;
    }

    protected resolveAdditionalData(): Promise<any> {
        return super.resolveAdditionalData().then(result => {
            return this.loadFormFields().then(_ => {
                return Promise.resolve(this.resolvedData);
            });
        });
    }

    private loadFormFields(): Promise<void> {
        return this._searchCaseCriteriaFieldsLoader.load();
    }
}
