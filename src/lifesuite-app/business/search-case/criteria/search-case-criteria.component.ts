import { Component, Injector, Injectable, Input } from '@angular/core';

import { IMessagingService, MessagingService } from 'life-core/messaging';
import {
    FormListFieldsUtil,
    FormLayoutConfig,
    FormFieldEvent,
    ListFieldConfig,
    FormDependentFieldEvent
} from 'life-core/component/dynamic-form';
import { TabStateManager, TabStateValueAccessor } from 'life-core/util';

import { LsDynamicFormViewModel, FormLoadDynamicMetadataService } from 'ls-core/component/dynamic-form';
import { PolicyByProductProxyDTO } from 'ls-core/model';

import { SearchCaseChannels } from '../search-case-channels';
import { SearchCaseCriteriaFormFields } from './search-case-criteria-form-fields';
import { SearchFormDataBuilder, SearchFormData } from './search-form-data.builder';
import { TabSearchCaseDataKeys } from '../search-case-data-keys';
import { StateDependentFieldHandler } from './dependent-field/state-dependent-field.handler';

const countryFilterList: string[] = ['CANADA', 'USA'];

@Component({
    selector: 'search-case-criteria',
    templateUrl: './search-case-criteria.component.html',
    styleUrls: ['search-case-criteria.component.css']
})
@Injectable()
export class SearchCaseCriteriaComponent extends LsDynamicFormViewModel {
    @Input()
    public index: string;
    public formLayoutConfig: FormLayoutConfig = {
        fieldsPerRow: 3
    };

    private _policyByProductProxyDTO: PolicyByProductProxyDTO;
    private _messagingService: IMessagingService;
    private _searchCaseCriteriaFormFields: SearchCaseCriteriaFormFields;
    private _formLoadDynamicMetadataService: FormLoadDynamicMetadataService;
    private _searchCriteriaStateValueAccessor: TabStateValueAccessor<SearchFormData>;

    constructor(
        injector: Injector,
        messagingService: MessagingService,
        searchCaseCriteriaFormFields: SearchCaseCriteriaFormFields,
        formLoadDynamicMetadataService: FormLoadDynamicMetadataService,
        tabStateManager: TabStateManager
    ) {
        super(injector);
        this._messagingService = messagingService;
        this._searchCaseCriteriaFormFields = searchCaseCriteriaFormFields;
        this._formLoadDynamicMetadataService = formLoadDynamicMetadataService;
        this.createStateValueAccessors(tabStateManager);
        this.initCriteria();
    }

    private createStateValueAccessors(tabStateManager: TabStateManager): void {
        this._searchCriteriaStateValueAccessor = new TabStateValueAccessor<SearchFormData>(
            tabStateManager,
            TabSearchCaseDataKeys.SEARCH_LIST_FILTERS
        );
    }

    private initCriteria(): void {
        if (this._searchCriteriaStateValueAccessor.hasValue()) {
            this.formData = this._searchCriteriaStateValueAccessor.getValue();
        }
        this._policyByProductProxyDTO = new PolicyByProductProxyDTO();
    }

    public ngAfterContentInit(): void {
        super.ngAfterContentInit();
        if (this._searchCriteriaStateValueAccessor.hasValue()) {
            this.onFormDependentFieldEvent(
                new FormDependentFieldEvent({ dependentFieldName: 'StateName', triggerFieldName: 'CountryName' })
            );
            this.searchCase();
        }        
    }

    public searchCase(): void {
        this.updateSearchCaseCriteria();
        this.publishSearchCaseCriteria();
    }

    private updateSearchCaseCriteria(): void {
        const policy = (this.formData as SearchFormData).policy;
        this._policyByProductProxyDTO = { ...policy } as PolicyByProductProxyDTO;
    }

    private publishSearchCaseCriteria(): void {
        this._messagingService.publish(SearchCaseChannels.SearchCaseCriteriaChanged, this._policyByProductProxyDTO);
    }

    protected setFormData(): void {
        this.formData = this._searchCriteriaStateValueAccessor.hasValue()
            ? SearchFormDataBuilder.build(this._searchCriteriaStateValueAccessor.getValue().policy)
            : SearchFormDataBuilder.build(new PolicyByProductProxyDTO());
    }

    protected setFormFields(): Promise<void> {
        this.formFields = this.copyFormFields(this._searchCaseCriteriaFormFields.get());
        this.getFilteredCountryList();
        this.preprocessFormFields();
        return Promise.resolve();
    }

    private getFilteredCountryList(): void {
        const countryField = this.getFormFieldByName('CountryName') as ListFieldConfig;
        if (countryField) {
            countryField.options = countryField.options.filter(
                country => countryFilterList.indexOf(country.value) != -1
            );
        }
    }

    protected preprocessFormFields(): Promise<void> {
        const listFieldsWithDynamicMetaType = FormListFieldsUtil.getListFieldsWithDynamicMetaType(this.formFields);
        return this._formLoadDynamicMetadataService.load(listFieldsWithDynamicMetaType, this.formData);
    }

    protected setupAuthorization(): void {}

    public ngOnDestroy(): void {
        this._messagingService.closeChannel(SearchCaseChannels.SearchCaseCriteriaChanged);
        
        super.ngOnDestroy();
    }

    public onSearchCaseClick(): void {
        this._searchCriteriaStateValueAccessor.setValue(this.formData as SearchFormData);
        this.searchCase();
    }

    public onClearClick(): void {
        this.resetCriteriaFields();
        if (this._searchCriteriaStateValueAccessor.hasValue()) {
            this._searchCriteriaStateValueAccessor.deleteValue();
        }
    }

    private resetCriteriaFields(): void {
        this.formData = SearchFormDataBuilder.build(new PolicyByProductProxyDTO());
    }

    protected setupDependentFieldHandlerRegistry(): void {
        this.dependentFieldHandlerRegistry.set('StateName', StateDependentFieldHandler);
    }
}
