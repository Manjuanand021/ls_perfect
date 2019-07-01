import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { BlockableUI } from 'primeng/primeng';

import { SessionTimeoutManager } from 'life-core/session';
import { AuthorizationProvider } from 'life-core/authorization';
import { ToasterMessage, ToasterMessageLife, ToasterChannels } from 'life-core/component/toaster';
import { SubscriptionTracker } from 'life-core/event/subscription-tracker';
import { IMessagingService, MessagingService } from 'life-core/messaging';
import { BrowserUtil, ChangeDetectionUtil } from 'life-core/util';
import { AppSession } from 'ls-core/session';

import { CaseGroupHubService } from 'business/shared/signalr';
import { AppInitializeErrorHandlers } from 'business/app';
import { DefaultAuthorizationProvider } from 'business/shared/authorization/default-authorization.provider';
import { LeftNavComponent } from 'ui/left-nav';
import { BusyStatus } from 'life-core/util/busy-status';
import { RouterNavigationStatus } from 'life-core/routing';
import { DataServiceStatus } from 'ls-core/service';

export const LANDING_HOST: any = {
    '(keydown.backspace)': 'onBackSpaceKeyPressed($event)',
    '(window:beforeunload)': 'onWindowBeforeUnload($event)'
};

@Component({
    selector: 'landing',
    templateUrl: './landing.component.html',
    host: LANDING_HOST,
    providers: [{ provide: AuthorizationProvider, useClass: DefaultAuthorizationProvider }]
})
export class LandingComponent implements AfterViewInit, OnDestroy, BlockableUI {
    public toasterMessages: ToasterMessage[] = [];
    public stickyToasterMessages: ToasterMessage[] = [];
    public toasterMessageLife: number = ToasterMessageLife;
    public thisComponent: LandingComponent = this;
    public busy: boolean;

    private _session: AppSession;
    private _sessionTimeoutManager: SessionTimeoutManager;
    private _caseGroupHubService: CaseGroupHubService;
    private _messagingService: IMessagingService;
    private _subscriptionTracker: SubscriptionTracker;
    private _appInitializeErrorHandlers: AppInitializeErrorHandlers;
    private _elementRef: ElementRef;
    private _busyStatus: BusyStatus;

    public collapseMenu: boolean = false;

    @ViewChild(LeftNavComponent)
    protected leftNavMenu: LeftNavComponent;

    constructor(
        session: AppSession,
        sessionManager: SessionTimeoutManager,
        messagingService: MessagingService,
        caseGroupHubService: CaseGroupHubService,
        appInitializeErrorHandlers: AppInitializeErrorHandlers,
        elementRef: ElementRef,
        routerNavigationStatus: RouterNavigationStatus,
        dataServiceStatus: DataServiceStatus
    ) {
        this._session = session;
        this._sessionTimeoutManager = sessionManager;
        this._messagingService = messagingService;
        this._caseGroupHubService = caseGroupHubService;
        this._appInitializeErrorHandlers = appInitializeErrorHandlers;
        this._busyStatus = new BusyStatus([routerNavigationStatus, dataServiceStatus]);
        this._elementRef = elementRef;
        this.initializeErrorHandlers();
        this.initializeSessionData();
        this.startSessionManager();
        this.setupSubscriptions();
    }

    public ngAfterViewInit(): void {
        this.initializeToasterMessaging();
        this.initializeSignalR();
    }

    public onBackSpaceKeyPressed(event: Event): void {
        BrowserUtil.supressEventInNonInputElement(event);
    }

    public onWindowBeforeUnload(event: Event): void {
        // Uncomment code to confirm before unloading window
        // event.returnValue = true;
        console.log('Processing beforeunload...');
    }

    public ngOnDestroy(): void {
        this.destroyToasterMessaging();
        this._busyStatus.destroy();
    }

    private initializeErrorHandlers(): void {
        this._appInitializeErrorHandlers.initialize();
    }

    private initializeSessionData(): void {
        this._session.isStandalone = false;
    }

    private startSessionManager(): void {
        this._sessionTimeoutManager.start(this._session.sessionTimeoutMinutes);
    }

    private setupSubscriptions(): void {
        // Use setTimeout() as a temporary workaround for
        // the issue related to updates to the change detection for
        // projected views (with <ng-contnent>) in Angular v4.2.
        // Otherwise, an error is generated:
        // Error: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked.
        // For more information, see
        // https://github.com/angular/angular/issues/17572
        // https://github.com/angular/angular/pull/16592

        this._busyStatus.subscribe(status =>
            ChangeDetectionUtil.supressExpressionChangedError(() => this.updateBusyStatus(status))
        );
    }

    private initializeToasterMessaging(): void {
        this._subscriptionTracker = new SubscriptionTracker();
        this._subscriptionTracker.track(
            this._messagingService.subscribe(ToasterChannels.Message, (message: ToasterMessage) => {
                this.toasterMessages = [];
                this.toasterMessages.push(message);
            })
        );
        this._subscriptionTracker.track(
            this._messagingService.subscribe(ToasterChannels.StickyMessage, (messages: Array<ToasterMessage>) => {
                this.stickyToasterMessages = [];
                this.stickyToasterMessages.push(...messages);
            })
        );
    }

    private destroyToasterMessaging(): void {
        this._subscriptionTracker.destroy();
        this._messagingService.closeChannel(ToasterChannels.Message);
        this._messagingService.closeChannel(ToasterChannels.StickyMessage);
    }

    private initializeSignalR(): Promise<void> {
        return this._caseGroupHubService.start();
    }

    public onSlideLeftNavMenu(isCollapsed: boolean): void {
        this.collapseMenu = isCollapsed;
    }

    public onTransitionEnd(e: TransitionEvent): void {
        if (e.propertyName == 'max-width') {
            this.leftNavMenu.promptAutoCollapseLeftNavDialog();
        }
    }

    // interface BlockableUI
    public getBlockableElement(): HTMLElement {
        return this._elementRef.nativeElement;
    }

    private updateBusyStatus(status: boolean): void {
        this.busy = status;
    }
}
