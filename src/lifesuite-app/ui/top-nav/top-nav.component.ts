import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';

import { Subscription } from 'rxjs';
import { ActionsSubject } from '@ngrx/store';

import { NameUtil } from 'life-core/util';
import { DataSavingFlags, DataSaveStatus } from 'life-core/reducer/actions';
import { Action } from 'life-core/reducer/action';
import { DialogButton, DialogButtonType, PopoverDialogParams } from 'life-core/component/dialog';
import { TabDescriptor } from 'life-core/component/layout/tabview';
import { IMessagingService, MessagingService } from 'life-core/messaging';
import { SessionTimeoutManager } from 'life-core/session';
import { SubscriptionTracker } from 'life-core/event/subscription-tracker';
import { ResolvedDataNames } from 'life-core/view-model';
import { I18n } from 'life-core/i18n';

import { AppSession } from 'ls-core/session/app-session';
import { LogoutHandler, LogoutReason } from 'ls-core/handler/logout';

import { AboutComponent, LifeSuiteVersionResolver } from './about-lifesuite';
import { TopNavChannels } from './messaging/top-nav-channels';
import { PrimaryTabType } from 'ui/tabview';
import { PreferencesHelper } from './preferences';
import { QuickSearchPolicyHandler } from 'ui/top-nav/search/quick-search-policy.handler';

@Component({
    selector: 'top-nav',
    templateUrl: './top-nav.component.html',
    styleUrls: ['./top-nav.component.css'],
    providers: [PreferencesHelper],
    encapsulation: ViewEncapsulation.None
})
export class TopNavComponent implements OnInit, OnDestroy {
    public userName: string;
    public infoString: string;
    public showInfo: boolean;
    public policyNumber: string;
    public isOutOfOffice: boolean;
    public isSavingData: boolean;

    private _messagingService: IMessagingService;
    private _appSession: AppSession;
    private _logoutHandler: LogoutHandler;
    private _sessionTimeoutManager: SessionTimeoutManager;
    private _preferencesHelper: PreferencesHelper;
    private _quickSearchHandler: QuickSearchPolicyHandler;
    private _subscriptionTracker: SubscriptionTracker;
    private i18n: I18n;

    public showSearchBar: boolean = false;

    public dialogAboutParams: PopoverDialogParams = {
        content: AboutComponent,
        resolve: [{ resolveName: ResolvedDataNames.data, resolverClass: LifeSuiteVersionResolver }],
        buttons: [new DialogButton({ type: DialogButtonType.OK })]
    };

    constructor(
        appSession: AppSession,
        messagingService: MessagingService,
        logoutHandler: LogoutHandler,
        sessionManager: SessionTimeoutManager,
        preferenceHelper: PreferencesHelper,
        quickSearchHandler: QuickSearchPolicyHandler,
        actionsSubject: ActionsSubject,
        i18n: I18n
    ) {
        this._appSession = appSession;
        this._messagingService = messagingService;
        this._logoutHandler = logoutHandler;
        this._sessionTimeoutManager = sessionManager;
        this._preferencesHelper = preferenceHelper;
        this.setUserName();
        this.setOutOfOffice();
        this._preferencesHelper.showOutOfOfficeConfirmDialog();
        this._quickSearchHandler = quickSearchHandler;
        this._subscriptionTracker = new SubscriptionTracker();
        this.subscribeToDataSave(actionsSubject);
        this.i18n = i18n;
    }

    public ngOnInit(): void {
        this.subscribeToTabViewChange();
        this.setAboutDialogueTitle();
    }

    public ngOnDestroy(): void {
        this._subscriptionTracker.destroy();
    }

    private setAboutDialogueTitle(): void {
        this.dialogAboutParams.title = this.i18n({ value: 'About UnderwritingPro', id: 'topnavbar.about.dialog.title' });
    }

    private setOutOfOffice(): void {
        this.isOutOfOffice = this._preferencesHelper.isOutOfOffice();
    }

    private subscribeToTabViewChange(): void {
        this._subscriptionTracker.track(
            this._messagingService.subscribe(TopNavChannels.UpdateTopNavbar, (tabData: TabDescriptor) =>
                setTimeout(() => {
                    this.setTopNavbarInfo(tabData);
                })
            )
        );
    }

    private setTopNavbarInfo(nwTabData: TabDescriptor): void {
        this.showInfo = nwTabData.tabType == PrimaryTabType.Policy;
        this.infoString = this.showInfo ? nwTabData.title : '';
    }

    private setUserName(): void {
        const user = this._appSession.user;
        this.userName = NameUtil.getFullName({
            title: user.Title,
            firstName: user.FirstName,
            middleName: user.MiddleName,
            lastName: user.LastName
        });
    }

    private subscribeToDataSave(actionsSubject: ActionsSubject): void {
        this._subscriptionTracker.track(
            actionsSubject.subscribe((action: Action<DataSaveStatus>) => {
                if (action.type === DataSavingFlags.DATA_SAVE_STATUS) {
                    this.isSavingData = action.payload == DataSaveStatus.InProgress;
                }
            })
        );
    }

    // Event Handlers

    public onSearchPolicyClick(event: Event): void {
        this._quickSearchHandler.execute(this.policyNumber);
    }

    public onLogoutClick(event: Event): void {
        event.preventDefault();
        this._logoutHandler.execute(LogoutReason.UserLogout);
        if (this._sessionTimeoutManager) {
            this._sessionTimeoutManager.stop();
        }
    }

    public onNavItemClick(event: Event): void {}

    public onPreferencesClick(): void {
        this._preferencesHelper.openPreferencesDialog();
    }

    public isSearchBarVisible(): void {
        this.showSearchBar = !this.showSearchBar;
    }
}
