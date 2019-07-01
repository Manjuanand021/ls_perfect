import { Component, Injector, EventEmitter } from '@angular/core';

import {
    IDialogViewModel,
    DialogButtonChangeEvent,
    IDialogButtonChangeEventEmitter,
    DialogViewModelResult,
    DialogButtonType
} from 'life-core/component/dialog';
import { ViewModel, ParentChildRegistry } from 'life-core/view-model';
import { AuthorizationProvider } from 'life-core/authorization';
import { ListItem } from 'life-core/model';
import { ConvertUtil } from 'life-core/util/lang';
import { NameUtil } from 'life-core/util';
import { Locale } from 'life-core/i18n';
import { UserLocalSettings } from 'life-core/local-settings';

import { PhoneUtil, AddressUtil } from 'ls-core/util';
import { UserDTO, PhoneTypes, PhoneDTO, AddressDTO, AddressTypes } from 'ls-core/model';
import { AppSession } from 'ls-core/session';

import { UserDataDelegate } from 'business/user/user-data.delegate';
import { DefaultAuthorizationProvider } from 'business/shared/authorization/default-authorization.provider';
import { ILocalSettingsService, LocalSettingsService } from 'life-core/local-settings';

@Component({
    selector: 'preferences-component',
    templateUrl: 'preferences.component.html',
    providers: [
        ParentChildRegistry,
        UserDataDelegate,
        { provide: AuthorizationProvider, useClass: DefaultAuthorizationProvider }
    ]
})
export class PreferencesComponent extends ViewModel implements IDialogViewModel, IDialogButtonChangeEventEmitter {
    public user: UserDTO;
    public userData: IUserData = {
        FullName: '',
        IsActive: '',
        IsUnderwriter: '',
        RestrictedToTeams: '',
        LoadBalancingFactor: 0,
        RoleName: ''
    };
    // TODO: get this list from MT?
    // or get it from locales registered in UI (using @Inject(APP_LOCALES))?
    public locales: Array<ListItem> = [
        new ListItem('English (American)', Locale.en_US.toLowerCase()),
        new ListItem('French (Canadian)', Locale.fr_CA.toLowerCase())
    ];
    public isOutOfOffice: boolean;
    public isLoadBalanceVisible: boolean;
    public workPhone: PhoneDTO;
    public faxPhone: PhoneDTO;
    public businessAddress: AddressDTO;
    public userLocalSettings: UserLocalSettings;
    public autoCollapseLeftMenuOptions: Array<ListItem> = [];

    private _userDataDelegate: UserDataDelegate;
    private _languageChanged: boolean = false;
    private _localSettingsService: ILocalSettingsService;
    private _appSession: AppSession;

    public dialogButtonChangeEventEmitter: EventEmitter<DialogButtonChangeEvent> = new EventEmitter<
        DialogButtonChangeEvent
    >();

    constructor(
        injector: Injector,
        userDataDelegate: UserDataDelegate,
        localSettingsService: LocalSettingsService,
        appSession: AppSession
    ) {
        super(injector);
        this._userDataDelegate = userDataDelegate;
        this._localSettingsService = localSettingsService;
        this._appSession = appSession;
        this.prepareAutoCollapseLeftMenuItems();
    }

    public loadData(): Promise<void> {
        return super.loadData();
    }

    public setModel(model: any): void {
        this.user = model.resolvedData.data;
        this.userLocalSettings = model.resolvedData.localSettings;
    }

    public ngAfterViewInit(): void {
        super.ngAfterViewInit();
        this.subscribeToFormStatusChange();
    }

    public prepareAutoCollapseLeftMenuItems(): void {
        this.autoCollapseLeftMenuOptions.push(new ListItem('Yes', 'true'));
        this.autoCollapseLeftMenuOptions.push(new ListItem('No', 'false'));
    }

    public setupData(): void {
        this.setupResolvedUserData();
        this.setLazyLoadProperties();
    }

    public getRoleName(): string {
        return this.user.Roles_LazyLoad.length > 0 ? this.user.Roles_LazyLoad[0].Name : '';
    }

    public onLanguageChange(value: string): void {
        this._languageChanged = true;
    }

    public onDialogButtonClick(buttonId: string): Promise<DialogViewModelResult> {
        if (buttonId == DialogButtonType.SAVE) {
            return this.savePreferences().then(() => {
                return new DialogViewModelResult(new PreferencesResult(this._languageChanged), true, false);
            });
        } else {
            return Promise.resolve(null);
        }
    }

    private setLazyLoadProperties(): void {
        this.initializeAddressAndPhoneLazyLoadsIfEmpty();
        this.setAddressAndPhoneData();
    }

    private initializeAddressAndPhoneLazyLoadsIfEmpty(): void {
        if (!this.user.Addresses_LazyLoad) {
            this.user.Addresses_LazyLoad = new Array<AddressDTO>();
        }
        if (!this.user.Phones_LazyLoad) {
            this.user.Phones_LazyLoad = new Array<PhoneDTO>();
        }
    }

    private setAddressAndPhoneData(): void {
        AddressUtil.addAddressIfNotFound(this.user.Addresses_LazyLoad, AddressTypes.BUSINESS);
        this.businessAddress = AddressUtil.getAddress(this.user.Addresses_LazyLoad, AddressTypes.BUSINESS);
        PhoneUtil.addPhoneIfNotFound(this.user.Phones_LazyLoad, PhoneTypes.WORK);
        this.workPhone = PhoneUtil.getPhone(this.user.Phones_LazyLoad, PhoneTypes.WORK);
        PhoneUtil.addPhoneIfNotFound(this.user.Phones_LazyLoad, PhoneTypes.FAX);
        this.faxPhone = PhoneUtil.getPhone(this.user.Phones_LazyLoad, PhoneTypes.FAX);
    }

    private setupResolvedUserData(): void {
        this.userData = {
            FullName: NameUtil.getFullName({
                firstName: this.user.FirstName,
                lastName: this.user.LastName
            }),
            IsActive: this.getYesNoByBinaryNumber(this.user.IsActive),
            IsUnderwriter: this.getYesNoByBinaryNumber(this.user.IsUnderwriter),
            RestrictedToTeams: this.getYesNoByBinaryNumber(this.user.RestrictToTeams),
            LoadBalancingFactor: this.getLoadBalancingFactor(),
            RoleName: this.getRoleName()
        };
        this.setIsOutOfOffice();
    }

    private getYesNoByBinaryNumber(abc: Object): string {
        return ConvertUtil.toNumber(abc) == -1 ? 'Yes' : 'No';
    }

    private savePreferences(): Promise<void> {
        this.user.OutOfOffice = this.isOutOfOffice ? -1 : 0;
        this._appSession.user.PreferredLanguageCode = this.user.PreferredLanguageCode;
        return this._userDataDelegate.updateData(this.user).then(result => {
            this.updateSessionUser(this.user);
            this.updateLocalUserSettings(this.userLocalSettings);
        });
    }

    private setIsOutOfOffice(): void {
        this.isOutOfOffice = this.user.OutOfOffice == -1;
    }

    private getLoadBalancingFactor(): number {
        if (this.user.IsUnderwriter || this.user.IsServiceAssociate) {
            this.isLoadBalanceVisible = true;
            return ConvertUtil.toNumber(this.user.LoadBalancingFactor);
        }
    }

    private updateSessionUser(user: UserDTO): void {
        this._appSession.user.PreferredLanguageCode = user.PreferredLanguageCode;
    }

    private updateLocalUserSettings(userLocalSettings: UserLocalSettings): void {
        this._localSettingsService.setAllUserSettings<UserLocalSettings>(userLocalSettings);
    }

    private subscribeToFormStatusChange(): void {
        const form = this.getRootForm();
        this.subscriptionTracker.track(
            form.statusChanges.subscribe(status => {
                this.updateDialogButtons(status);
            })
        );
    }

    private updateDialogButtons(formStatus: string): void {
        this.dialogButtonChangeEventEmitter.emit(
            new DialogButtonChangeEvent({
                type: DialogButtonType.SAVE,
                disabled: formStatus == 'INVALID'
            })
        );
    }
}

interface IUserData {
    FullName: string;
    IsActive: string;
    IsUnderwriter: string;
    RestrictedToTeams: string;
    LoadBalancingFactor: number;
    RoleName: string;
}

export class PreferencesResult {
    public languageChanged: boolean;

    constructor(languageChanged: boolean) {
        this.languageChanged = languageChanged;
    }
}
