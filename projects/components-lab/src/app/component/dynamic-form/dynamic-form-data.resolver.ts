import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { FieldConfig } from 'life-core/component/dynamic-form';
import { FormLoadFieldsService, LsFormTypes } from 'ls-core/component/dynamic-form';
import { formFieldsConfig } from 'lab/shared/mock-service/mock-response/formdata/formdata.response';
import { formData1 } from './dynamic-form.data';
import { UserListResolver } from './user-list.resolver';

/**
 *  Base view data resolver class to pre-fetch data for components(ViewModels).
 *  The resolver classes are connected to components via the 'resolve' parameter of a Route.
 */
@Injectable()
export class DynamicFormDataResolver implements Resolve<Array<FieldConfig[]>> {
    private _formLoadFieldsService: FormLoadFieldsService;

    protected resolvedData: any;

    constructor(formLoadFieldsService: FormLoadFieldsService) {
        this._formLoadFieldsService = formLoadFieldsService;
    }

    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Array<FieldConfig[]>> {
        const includedFieldNames = formFieldsConfig.map(fieldConfig => fieldConfig.name);

        const resolves = [{ resolveName: 'userList', resolverClass: UserListResolver, context: null }];

        return this._formLoadFieldsService.load(
            LsFormTypes.PolicyCoverage,
            null,
            [includedFieldNames],
            formData1,
            formData1.policy,
            resolves
        );
    }
}
