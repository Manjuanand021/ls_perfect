import { Component, OnDestroy, Output, EventEmitter, ViewChild } from '@angular/core';

import { IMessagingService, MessagingService } from 'life-core/messaging';
import { IGetDataDelegate } from 'life-core/service';
import { TabDescriptor } from 'life-core/component/layout/tabview';
import { MenuItem, MenuItemClickEvent } from 'life-core/component/menu';
import { SubscriptionTracker } from 'life-core/event/subscription-tracker';
import { ILocalSettingsService, LocalSettingsService } from 'life-core/local-settings/local-settings.service';
import { DialogButtonType, PopoverDialog, PopoverDialogParams } from 'life-core/component/dialog';
import {
    LocalSettingPromptComponent,
    LocalSettingPromptData,
    QueryLocalSetting,
    LocalSettingPromptDialogResult
} from 'life-core/local-settings';

import { LeftNavChannels } from './messaging/left-nav-channels';
import { LeftMenuDataDelegate, LeftNavigationMenuRequest } from './left-menu-data.delegate';
import { MenuItemClickHandler } from './menu-item-click.handler';
import { LocalSettings, LocalSettingPromptService } from 'life-core/local-settings';

@Component({
    selector: 'left-nav',
    templateUrl: './left-nav.component.html',
    styleUrls: ['./left-nav.component.css'],
    providers: [MenuItemClickHandler, LocalSettingPromptService]
})
export class LeftNavComponent implements OnDestroy {
    @Output()
    public slideEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
    public menuCollapsed: boolean = false;
    public menuData: MenuItem[];

    public autoCollapseLeftNavPopoverParams: PopoverDialogParams = {
        content: LocalSettingPromptComponent,
        title: 'Confirm Preference',
        data: new LocalSettingPromptData(LocalSettings.AutoCollapseLeftNav),
        placement: 'right',
        triggers: 'manual'
    };

    private _messagingService: IMessagingService;
    private _menuDataDelegate: IGetDataDelegate<LeftNavigationMenuRequest>;
    private _menuItemClickHandler: MenuItemClickHandler;
    private _leftNavClicked: boolean = false;
    private _subscriptionTracker: SubscriptionTracker;
    private _localSettingsService: ILocalSettingsService;
    private _isLeftNavCollapsedProgramatically: boolean = false;
    private _localSettingPromptService: LocalSettingPromptService;

    @ViewChild(PopoverDialog)
    private _leftNavAutoCollapsePromptPopover: PopoverDialog;

    constructor(
        messagingService: MessagingService,
        menuDataDelegate: LeftMenuDataDelegate,
        menuItemClickHandler: MenuItemClickHandler,
        localSettingsService: LocalSettingsService,
        localSettingPromptService: LocalSettingPromptService
    ) {
        this._messagingService = messagingService;
        this._menuDataDelegate = menuDataDelegate;
        this._menuItemClickHandler = menuItemClickHandler;
        this._subscriptionTracker = new SubscriptionTracker();
        this.initSubscribers();
        this._localSettingsService = localSettingsService;
        this._localSettingPromptService = localSettingPromptService;
    }

    public onMenuItemClick(event: MenuItemClickEvent): void {
        this._menuItemClickHandler.onMenuItemClick(event);
    }

    public ngOnDestroy(): void {
        this._messagingService.closeChannel(LeftNavChannels.CollapseLeftNav);
        this._messagingService.closeChannel(LeftNavChannels.ExpandLeftNav);
        this._subscriptionTracker.destroy();
    }

    public onSlideLeftNavClick(): void {
        this.setLeftNavClickedFlag(true);
        this.slideLeftNav();
    }

    public get slidingMenuButtonClass(): string {
        return this.menuCollapsed
            ? 'lf-sliding-menu-btn expanded fa fa-arrow-circle-right fa-2x'
            : 'lf-sliding-menu-btn collapsed fa fa-arrow-circle-left fa-2x';
    }

    private initSubscribers(): void {
        this._subscriptionTracker.track([
            this._messagingService.subscribe(LeftNavChannels.UpdateLeftNavMenu, newTab => this.updateLeftNav(newTab)),
            this._messagingService.subscribe(LeftNavChannels.CollapseLeftNav, () =>
                this.collapseLeftNavProgramatically()
            ),
            this._messagingService.subscribe(LeftNavChannels.ExpandLeftNav, () => this.expandLeftNavProgramatically())
        ]);
    }

    private expandLeftNavProgramatically(): void {
        if (this.menuCollapsed && this._isLeftNavCollapsedProgramatically) {
            this.setMenuCollapsedFlag(false);
            this.setLeftNavCollapsedProgramaticallyFlag(false);
            this.setLeftNavClickedFlag(false);
            this.triggerSlideEvent();
        }
    }

    private toggleMenuCollapsedFlag(): void {
        this.setMenuCollapsedFlag(!this.menuCollapsed);
    }

    private updateLeftNav(newTab: TabDescriptor): void {
        this.updateActiveTab(newTab);
        this.updateMenu(newTab);
    }

    private updateActiveTab(newTab: TabDescriptor): void {
        this._menuItemClickHandler.updateActiveTab(newTab);
    }

    private updateMenu(newTab: TabDescriptor): void {
        this._menuDataDelegate.getData(new LeftNavigationMenuRequest(newTab.menuId, newTab.objectId)).then(menuData => {
            this.menuData = menuData;
        });
    }

    private collapseLeftNavProgramatically(): void {
        const autoCollapseLeftNavSetting = this.getAutoCollapseLeftNavSetting();
        if (autoCollapseLeftNavSetting && autoCollapseLeftNavSetting.value == false) {
            // if auto collapse left menu setting is false, don't do anything
        } else if (!this.menuCollapsed) {
            this.setLeftNavCollapsedProgramaticallyFlag(true);
            this.setLeftNavClickedFlag(false);
            this.setMenuCollapsedFlag(true);
            this.triggerSlideEvent();
        }
    }

    private slideLeftNav(): void {
        this.toggleMenuCollapsedFlag();
        this.triggerSlideEvent();
    }

    public promptAutoCollapseLeftNavDialog(): void {
        if (this._isLeftNavCollapsedProgramatically && this._leftNavClicked) {
            this._localSettingPromptService.showLocalSettingPrompt<boolean>({
                settingName: LocalSettings.AutoCollapseLeftNav,
                popoverDialog: this._leftNavAutoCollapsePromptPopover,
                popoverParams: this.autoCollapseLeftNavPopoverParams,
                settingValueResolver: this.shouldCollapseLeftNav
            });
            this.setLeftNavCollapsedProgramaticallyFlag(false);
        }
    }

    private getAutoCollapseLeftNavSetting(): QueryLocalSetting<boolean> {
        return this._localSettingsService.getUserSetting<QueryLocalSetting<boolean>>(LocalSettings.AutoCollapseLeftNav);
    }

    private triggerSlideEvent(): void {
        this.slideEvent.emit(this.menuCollapsed);
    }

    private setLeftNavClickedFlag(value: boolean): void {
        this._leftNavClicked = value;
    }

    private setLeftNavCollapsedProgramaticallyFlag(value: boolean): void {
        this._isLeftNavCollapsedProgramatically = value;
    }

    private setMenuCollapsedFlag(value: boolean): void {
        this.menuCollapsed = value;
    }

    private shouldCollapseLeftNav(localSettingPromptDialogResult: LocalSettingPromptDialogResult): boolean {
        return localSettingPromptDialogResult.buttonId == DialogButtonType.NO;
    }
}
