import { Component, Injector, Type } from '@angular/core';
import {
    IDialogViewModel,
    DialogData,
    DialogButtonType,
    DialogViewModelResult,
    DialogButton,
    ConfirmDialog,
    DialogResult
} from 'life-core/component/dialog';
import { IComponentResolver, ComponentResolver, ComponentMap } from 'life-core/util';
import { MedicalProviderProxyDTO, filterCountryListPredicate } from 'ls-core/model';
import {
    PhysicianNameComponent,
    PhysicianFacilityNameComponent,
    PhysicianAssociatedWithFacilityComponent
} from './medical-provider-types';
import { ICompose } from 'life-core/component/compose';
import { ViewModel, ParentChildRegistry, ViewValidationResult } from 'life-core/view-model';
import { ListItem } from 'life-core/model';
import { AuthorizationProvider } from 'life-core/authorization';
import { I18n } from 'life-core/i18n';
import { ProviderSearchTypes } from 'ls-core/model';
import { MedicalProviderService } from './medical-provider.service';
import { RequirementsAuthorizationProvider } from 'business/policy/requirements/requirements-authorization.provider';

interface IProviderSearchFilter {
    searchType: string;
    countryID: string;
    state: string;
    city: string;
    lastName: string;
    firstName: string;
    organization: string;
    providerSearchSource: string;
}

@Component({
    selector: 'medical-provider-search',
    templateUrl: './medical-provider-search.component.html',
    styleUrls: ['./medical-provider-search.component.css'],
    providers: [
        ParentChildRegistry,
        MedicalProviderService,
        { provide: AuthorizationProvider, useClass: RequirementsAuthorizationProvider }
    ]
})
export class MedicalProviderSearchComponent extends ViewModel implements ICompose, IDialogViewModel {
    public searchFilter: IProviderSearchFilter;

    public searchTypes: ListItem[];

    public activeSearchType: string;

    public medicalProviders: MedicalProviderProxyDTO[];

    public itemComponentType: Type<any>;

    protected confirmDialog: ConfirmDialog;

    private _selectedMedicalProvider: MedicalProviderProxyDTO;

    private _medicalProviderService: MedicalProviderService;

    private _componentMapResolver: IComponentResolver<string>;

    constructor(injector: Injector, medicalProviderService: MedicalProviderService) {
        super(injector);
        this._medicalProviderService = medicalProviderService;
        this._componentMapResolver = this.getComponentMapResolver();
        this.confirmDialog = injector.get(ConfirmDialog);
        this.i18n = injector.get(I18n);
    }

    public setModel(model: DialogData): void {
        this.initializeSearchFilter();
        this.setContext(model);
    }

    public loadData(): Promise<void> {
        // show default filter section
        this.setItemComponentType(ProviderSearchTypes.PHYSICIAN_NAME);
        this.setFormDataToInitialState();
        return Promise.resolve();
    }

    public onDialogButtonClick(buttonId: string): Promise<DialogViewModelResult> {
        if (buttonId == DialogButtonType.SELECT) {
            const isDirty = this.isDirty();
            if (this.isMedicalProviderSearchFieldsEmpty() || !!this._selectedMedicalProvider) {
                return this.validate().then(result => {
                    if (result) {
                        this._selectedMedicalProvider.CountryID = this.searchFilter.countryID || '';
                        const selectedMedicalProvider = { selectedMedicalProvider: this._selectedMedicalProvider };
                        const isMedicalProviderExistFlag: boolean = !!this._selectedMedicalProvider;
                        const closeDialog = result == ViewValidationResult.pass && isMedicalProviderExistFlag;
                        return Promise.resolve(
                            new DialogViewModelResult(selectedMedicalProvider, closeDialog, isDirty)
                        );
                    } else {
                        return Promise.resolve(new DialogViewModelResult([], false));
                    }
                });
            } else if (
                !(this.isMedicalProviderSearchFieldsEmpty() && !!this._selectedMedicalProvider) &&
                this.medicalProviders.length > 0
            ) {
                this.confirmSelectionDialog();
                return Promise.resolve(new DialogViewModelResult({}, false));
            } else if (
                !(
                    this.isMedicalProviderSearchFieldsEmpty() &&
                    !!(this.medicalProviders.length <= 0) &&
                    !!this._selectedMedicalProvider
                )
            ) {
                this.confirmSearchDialog();
                return Promise.resolve(new DialogViewModelResult({}, false));
            }
        } else {
            return Promise.resolve(null);
        }
    }

    public onMedicalProviderSelection(event: MedicalProviderProxyDTO): void {
        this._selectedMedicalProvider = event;
    }

    public onProviderSearchTypeChange(providerSearchType: any): void {
        if (providerSearchType) {
            this.setFormDataToInitialState(providerSearchType.value);
        }
    }

    public onSearchButtonClick(): void {
        this.validate().then(result => {
            if (result) {
                this.invokeMedicalProviderSearch();
            }
        });
    }

    public setFormDataToInitialState(searchType?: string): void {
        this.activeSearchType = searchType || ProviderSearchTypes.PHYSICIAN_NAME;
        this.resetView();
        this.medicalProviders = [];
    }

    private isMedicalProviderSearchFieldsEmpty(): boolean {
        return this.searchFilter.searchType === 'mp'
            ? this.isCountryStateAvaliable() ||
                  this.searchFilter.lastName === undefined ||
                  this.searchFilter.lastName === '' ||
                  this.searchFilter.lastName === null
            : this.isCountryStateAvaliable() ||
                  this.searchFilter.organization === undefined ||
                  this.searchFilter.organization === '' ||
                  this.searchFilter.organization === null;
    }

    private isCountryStateAvaliable(): boolean {
        return (
            this.searchFilter.countryID === undefined ||
            this.searchFilter.countryID === '' ||
            this.searchFilter.countryID === null ||
            this.searchFilter.state === undefined ||
            this.searchFilter.state === '' ||
            this.searchFilter.state === null ||
            this.searchFilter.city === undefined ||
            this.searchFilter.city === '' ||
            this.searchFilter.city === null
        );
    }

    private resetView(): void {
        this.form.resetForm({
            searchType: this.activeSearchType
        });
        this.switchView(this.activeSearchType);
    }

    private confirmSelectionDialog(): Promise<DialogResult> {
        return this.confirmDialog.open({
            title: this.getWarningDialogTitle(),
            message: this.getConfirmSelectionMessage(),
            buttons: [
                new DialogButton({ type: DialogButtonType.OK }),
                new DialogButton({ type: DialogButtonType.CANCEL, options: { isDefault: true } })
            ]
        });
    }

    private confirmSearchDialog(): Promise<DialogResult> {
        return this.confirmDialog.open({
            title: this.getWarningDialogTitle(),
            message: this.getConfirmSearchMessage(),
            buttons: [
                new DialogButton({ type: DialogButtonType.OK }),
                new DialogButton({ type: DialogButtonType.CANCEL, options: { isDefault: true } })
            ]
        });
    }

    private getWarningDialogTitle(): string {
        return this.i18n({
            value: 'Warning',
            id: 'policy.requirement.medicalprovidersearch.dialog.warning.title'
        });
    }

    private getConfirmSelectionMessage(): string {
        return this.i18n({
            value: 'Please select a record.',
            id: 'policy.requirement.medicalprovidersearch.dialog.selection.message'
        });
    }

    private getConfirmSearchMessage(): string {
        return this.i18n({
            value: 'Please perform valid search.',
            id: 'policy.requirement.medicalprovidersearch.dialog.search.message'
        });
    }

    private initializeSearchFilter(): void {
        this.searchFilter = {
            searchType: ProviderSearchTypes.PHYSICIAN_NAME,
            state: '',
            city: '',
            lastName: '',
            firstName: '',
            organization: '',
            providerSearchSource: 'LS',
            countryID: ''
        };
    }

    private setContext(model: any): void {
        this.data = model;
        this.data.resolvedData.listData.CountryId = this.data.resolvedData.listData.CountryId.filter(
            filterCountryListPredicate
        );
        this.data.searchFilter = this.searchFilter;
        this.activeSearchType = this.searchFilter.searchType;
    }

    private getComponentMapResolver(): IComponentResolver<string> {
        const componentMap: ComponentMap = new ComponentMap();
        componentMap.add(ProviderSearchTypes.PHYSICIAN_NAME, PhysicianNameComponent);
        componentMap.add(ProviderSearchTypes.FACILITY_NAME, PhysicianFacilityNameComponent);
        componentMap.add(
            ProviderSearchTypes.PHYSICIAN_ASSOCIATED_WITH_FACILITY,
            PhysicianAssociatedWithFacilityComponent
        );
        return new ComponentResolver<string>(componentMap);
    }

    private switchView(searchType: string): void {
        this.setItemComponentType(searchType);
    }

    private setItemComponentType(searchType: string): void {
        this.itemComponentType = this._componentMapResolver.resolve(searchType);
    }

    private invokeMedicalProviderSearch(): void {
        const params = this.getSearchParameters();
        this._medicalProviderService.fetchMedicalProviderList(params).then((result: MedicalProviderProxyDTO[]) => {
            this.medicalProviders = result;
        });
    }

    private getSearchParameters(): string[] {
        const searchParams = { ...this.searchFilter, ...this.data['searchFilter'] };
        return this.getFilterValues(searchParams);
    }

    private getFilterValues(filter: Object): Array<any> {
        return Object.keys(filter).map(key => filter[key]);
    }
}
