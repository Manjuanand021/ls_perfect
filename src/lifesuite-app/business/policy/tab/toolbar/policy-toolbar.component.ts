import { Component, Injector, ViewChild } from '@angular/core';

import { IMessagingService, MessagingService } from 'life-core/messaging';
import { ToolbarButton, ToolBarElement, ToolBarKey } from 'life-core/component/toolbar';
import {
    ViewModel,
    FormValidationMessage,
    ServerValidationMessage,
    ViewValidationChannels,
    ViewValidationHandler,
    ViewValidationHandlerParams
} from 'life-core/view-model';
import { PanelChannels } from 'life-core/component/layout/panel/panel-channels';
import { LfSplitPaneChannels } from 'life-core/component/layout/split';
import { ValidationPopoverDataManager } from 'life-core/view-model/validation';

import { AppSession } from 'ls-core/session';
import { OpenURLDelegate } from 'ls-core/handler/open-url-delegate';
import { SavePolicyDataDelegate } from 'ls-core/service';
import { PolicyDTO } from 'ls-core/model';
import { LsPolicyToolbar } from 'ls-core/component/toolbar/ls-policy-toolbar';

import {
    ToolBarService,
    ToolBarSetupDelegate,
    ToolBarType,
    ToolBarButtonType,
    ToolBarButtonAction
} from 'business/shared/toolbar';
import { LogPerformanceDelegate } from 'business/policy/shared/log-performance/log-performance.delegate';
import { RefreshPolicyHandler } from 'business/policy/shared/refresh-policy/refresh-policy.handler';
import {
    OpenCaseLogViewDelegate,
    UnderwriteCaseDelegate,
    ValidationButtonDelegate,
    OpenHelpDelegate
} from './delegates';
import { TabPolicySplitPaneAreas } from '../split-container/tab-policy-split-pane-areas';
import { PolicyToolbarButtonType } from './policy-toolbar-button-type';
import { PolicyToolBarButtonAction } from './policy-toolbar-button-action';
import { OpenViewNotesDelegate } from './delegates/open-view-notes.delegate';
import { I18n } from 'life-core/i18n';

@Component({
    selector: 'policy-toolbar',
    templateUrl: './policy-toolbar.component.html',
    styleUrls: ['./policy-toolbar.component.css'],
    providers: [ValidationPopoverDataManager]
})
export class PolicyToolbarComponent extends ViewModel {
    public toolbarButtons: ToolbarButton[] = [];

    @ViewChild(LsPolicyToolbar)
    private _toolbar: LsPolicyToolbar;
    private _appSession: AppSession;
    private _messagingService: IMessagingService;
    private _validationButtonDelegate: ValidationButtonDelegate;
    private _toolBarService: ToolBarService;
    private _toolBarSetupDelegate: ToolBarSetupDelegate;
    private _toolBarButtonsMap: { readonly [action: string]: Function };
    private _openURLDelegate: OpenURLDelegate;
    private _logPerformanceDelegate: LogPerformanceDelegate;
    private _validationPopoverDataManager: ValidationPopoverDataManager;
    constructor(
        injector: Injector,
        appSession: AppSession,
        messagingService: MessagingService,
        toolBarService: ToolBarService,
        toolBarSetupDelegate: ToolBarSetupDelegate,
        logPerformanceDelegate: LogPerformanceDelegate,
        validationPopoverDataManager: ValidationPopoverDataManager,
        openURLDelegate: OpenURLDelegate,
        i18n: I18n
    ) {
        super(injector);
        this._appSession = appSession;
        this._messagingService = messagingService;
        this._validationButtonDelegate = new ValidationButtonDelegate();
        this._toolBarService = toolBarService;
        this._toolBarSetupDelegate = toolBarSetupDelegate;
        this._openURLDelegate = openURLDelegate;
        this._logPerformanceDelegate = logPerformanceDelegate;
        this._validationPopoverDataManager = validationPopoverDataManager;
        this.setupSubscriptions();
        this.i18n = i18n;
    }

    public loadData(): Promise<void> {
        this._toolBarService.loadToolBar(this.buildToolBarKey()).then((linkItems: ToolBarElement[]) => {
            this.setupToolBarButtons(linkItems);
        });
        return Promise.resolve();
    }

    public ngAfterViewInit(): void {
        super.ngAfterViewInit();
        this.setupToolBarButtonsMap();
    }

    protected setupSubscriptions(): void {
        this.subscriptionTracker.track(
            this._messagingService.subscribeNewMessageOnly(
                ViewValidationChannels.FormValidationMessagesChange,
                (messages: FormValidationMessage[]) => this.onFormValidationMessagesChange(messages)
            )
        );
        this.subscriptionTracker.track(
            this._messagingService.subscribeNewMessageOnly(
                ViewValidationChannels.ServerValidationMessagesChange,
                (messages: ServerValidationMessage[]) => this.onServerValidationMessagesChange(messages)
            )
        );
    }

    protected getDataToSave(): PolicyDTO {
        return this._appSession.policyDTO;
    }

    protected getSaveDataDelegate(): SavePolicyDataDelegate {
        return this.injector.get(SavePolicyDataDelegate);
    }

    private buildToolBarKey(): ToolBarKey {
        return new ToolBarKey({
            toolBarName: ToolBarType.POLICY,
            objectId: this._appSession.policyId.toString()
        });
    }

    private setupToolBarButtons(linkItems: ToolBarElement[]): void {
        this.toolbarButtons = this._toolBarSetupDelegate.setup(
            linkItems,
            ({ action, event, labelValue }: { action: string; event?: Event; labelValue?: string }) =>
                this.onToolBarButtonClick({ action, labelValue, event })
        );
        this.setValidationDialogParams();
    }

    private setValidationDialogParams(): void {
        const button = this.getButton(ToolBarButtonType.VALIDATE);
        button.popoverParams.data = this._validationPopoverDataManager.popoverDataAsObservable();
        button.popoverParams.title = this.i18n({ value: 'Validation Errors', id: 'policy.toolbar.errorpopover.title' });
    }

    private setupToolBarButtonsMap(): void {
        this._toolBarButtonsMap = {
            [ToolBarButtonAction.VALIDATE]: () => this.onButtonValidationClick(),
            [ToolBarButtonAction.SAVE_REFRESH]: () => this.onButtonSaveRefreshClick(),
            [ToolBarButtonAction.FAVORITES_ICON]: (event: Event) => this.onFavoriteIconClick(event),
            [ToolBarButtonAction.FAVORITES]: ({ labelValue: string }) =>
                this.onFavoritesLinkClick({ labelValue: string }),
            [PolicyToolBarButtonAction.ACTION_NOTE]: (event: Event) => this.onButtonNotesClick(event),
            [PolicyToolBarButtonAction.VIEW_NOTES]: (event: Event) => this.onViewNotesClick(),
            [PolicyToolBarButtonAction.ADD_CASE_NOTES]: () => this.onAddCaseNotesClick(),
            [PolicyToolBarButtonAction.ADD_UW_NOTES]: () => this.onAddUWNotesClick(),
            [PolicyToolBarButtonAction.VIEW_CASE_LOG]: () => this.onButtonCaseLogClick(),
            [PolicyToolBarButtonAction.UNDERWRITE]: () => this.onButtonUnderwriteClick(),
            [ToolBarButtonAction.HELP]: () => this.onButtonHelpClick(),
            [PolicyToolBarButtonAction.VIEW_SCRATCHPAD]: () => this.onViewScratchPadClick(),
            [PolicyToolBarButtonAction.EXPAND_COLLAPSE_PANELS]: (event: Event) => this.onButtonPanelsClick(event),
            [PolicyToolBarButtonAction.EXPAND_PANELS]: () => this.onExpandPanelsClick(),
            [PolicyToolBarButtonAction.COLLAPSE_PANELS]: () => this.onCollapsePanelsClick()
        };
    }

    private onToolBarButtonClick({
        action,
        event,
        labelValue
    }: {
        action: string;
        event?: Event;
        labelValue?: string;
    }): void {
        const toolBarButtonClickHandler = this._toolBarButtonsMap[action];
        if (toolBarButtonClickHandler) {
            if (labelValue) {
                toolBarButtonClickHandler({ labelValue: labelValue });
            } else {
                toolBarButtonClickHandler({ event: event });
            }
        }
    }

    private onButtonValidationClick(): void {
        const viewValidationHandler = this.injector.get(ViewValidationHandler);
        viewValidationHandler.execute(new ViewValidationHandlerParams(this.parentChildRegistry.root));
    }

    private onButtonNotesClick(event: Event): void {
        if (event) {
            this._toolbar.getSplitButton(PolicyToolbarButtonType.NOTE).onDropdownButtonClick(event);
        }
    }

    private onViewNotesClick(): void {
        const openViewNotesDelegate = this.injector.get(OpenViewNotesDelegate);
        openViewNotesDelegate.openView();
    }

    private onAddCaseNotesClick(): void {
        this._messagingService.publish(LfSplitPaneChannels.AddSplitPaneArea, {
            areaId: TabPolicySplitPaneAreas.AddCaseNote
        });
    }

    private onAddUWNotesClick(): void {
        this._messagingService.publish(LfSplitPaneChannels.AddSplitPaneArea, {
            areaId: TabPolicySplitPaneAreas.AddUWNote
        });
    }

    private onViewScratchPadClick(): void {
        this._messagingService.publish(LfSplitPaneChannels.AddSplitPaneArea, {
            areaId: TabPolicySplitPaneAreas.ScratchPad
        });
    }

    private onButtonCaseLogClick(): void {
        const openCaseLogViewDelegate = this.injector.get(OpenCaseLogViewDelegate);
        openCaseLogViewDelegate.openView();
    }

    private onButtonUnderwriteClick(): void {
        this.saveData().then(() => {
            const underwriteCaseDelegate = this.injector.get(UnderwriteCaseDelegate);
            underwriteCaseDelegate.underwrite();
        });
    }

    private onButtonHelpClick(): void {
        this.injector.get(OpenHelpDelegate).openURL();
    }

    private onButtonSaveRefreshClick(): void {
        this._logPerformanceDelegate.log(true, this._appSession.policyDTO.PolicyNumber, 'caseRefresh');

        const refreshPolicyHandler = this.injector.get(RefreshPolicyHandler);
        this.changeManager.setIsDirty(this.isDirty());
        refreshPolicyHandler.setViewValidationDelegate(this.viewValidationDelegate);
        refreshPolicyHandler.execute();
    }

    private onFavoritesLinkClick(pageLink: { labelValue: string }): void {
        if (pageLink.labelValue) {
            this._openURLDelegate.openURL(pageLink.labelValue);
        }
    }

    private onFavoriteIconClick(event: Event): void {
        this._toolbar.getSplitButton(PolicyToolbarButtonType.FAVORITES).onDropdownButtonClick(event);
    }

    private onButtonPanelsClick(event: Event): void {
        this._toolbar.getSplitButton(PolicyToolbarButtonType.EXPAND_COLLAPSE_PANEL).onDropdownButtonClick(event);
    }

    private onExpandPanelsClick(): void {
        this._messagingService.publish(PanelChannels.ExpandAllPanels);
    }

    private onCollapsePanelsClick(): void {
        this._messagingService.publish(PanelChannels.CollapseAllPanels);
    }

    private onFormValidationMessagesChange(messages: FormValidationMessage[]): void {
        this._validationButtonDelegate.onFormValidationMessagesChange(messages);
        this.showHideValidationButton();
    }

    private onServerValidationMessagesChange(messages: ServerValidationMessage[]): void {
        this._validationButtonDelegate.onServerValidationMessagesChange(messages);
        this.showHideValidationButton();
    }

    private showHideValidationButton(): void {
        const button = this.getButton(ToolBarButtonType.VALIDATE);
        const needToShowButton = this._validationButtonDelegate.needToShowValidationButton();
        if (button) {
            // not sure how to remove toolbar-button-medium class, hence resetting button icon
            button.icon = 'toolbar-button-small button-validate';
            this.showHideButton(button, needToShowButton);
        }
        if (needToShowButton) {
            this.setButtonBadge(button);
            this.updatePopoverDialogData();
        }
    }

    private setButtonBadge(button: ToolbarButton): void {
        button.badge = this._validationButtonDelegate.validationMessageCount.toString();
    }

    private updatePopoverDialogData(): void {
        this._validationPopoverDataManager.updatePopoverData({
            validationMessages: this._validationButtonDelegate.getValidationMessagesData(),
            formInputs: this.parentChildRegistry.combinedFormInputs
        });
    }

    private showHideButton(button: ToolbarButton, needToShowButton: boolean): void {
        button.visible = needToShowButton;
    }

    private getButton(buttonId: string): ToolbarButton {
        return this.toolbarButtons.find(button => button.id == buttonId);
    }

    public ngOnDestroy(): void {
        this._messagingService.closeChannel(ViewValidationChannels.RenderValidationMessages);
        super.ngOnDestroy();
    }
}
