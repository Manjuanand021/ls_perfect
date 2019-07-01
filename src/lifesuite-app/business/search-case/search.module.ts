import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DYNAMIC_FIELDS_REGISTRY } from 'life-core/component/dynamic-form';
import { LsComponentsModule } from 'ls-core/component/ls-components.module';
import { LsDynamicFieldsRegistry } from 'ls-core/component/dynamic-form';
import {
    SearchCaseCriteriaFormFields,
    SearchCaseCriteriaFieldsLoader,
    SearchCaseCriteriaDataResolver,
    SearchCaseCriteriaBuilder,
    TabSearchCaseComponent,
    SearchCaseCriteriaComponent,
    SearchRoutingModule
} from '../search-case';
import { SearchCaseMetaDataResolver } from './search-case-metadata.resolver';
import { CaseListComponent } from './case-list';
import { StateDependentFieldHandler } from './criteria/dependent-field/state-dependent-field.handler';

@NgModule({
    imports: [CommonModule, FormsModule, LsComponentsModule, SearchRoutingModule],
    declarations: [TabSearchCaseComponent, SearchCaseCriteriaComponent, CaseListComponent],
    providers: [
        { provide: DYNAMIC_FIELDS_REGISTRY, useValue: LsDynamicFieldsRegistry },
        SearchCaseCriteriaFormFields,
        SearchCaseCriteriaFieldsLoader,
        SearchCaseCriteriaDataResolver,
        SearchCaseMetaDataResolver,
        SearchCaseCriteriaBuilder,
        StateDependentFieldHandler
    ]
})
export class SearchModule {}
