import { Component, Injector, ViewChild } from '@angular/core';

import { PrimaryTabHostViewModel, TabChannels } from 'life-core/component/layout/tabview';
import { MessagingService } from 'life-core/messaging';
import { TabStateManager, TabStateValueAccessor } from 'life-core/util';
import { ConvertUtil } from 'life-core/util/lang';
import { AuthorizationProvider } from 'life-core/authorization';
import { ListItem } from 'life-core/model/list.model';

import { ListDataItem } from 'ls-core/service';
import { PolicyProxyDTO } from 'ls-core/model';

import { DefaultAuthorizationProvider } from 'business/shared/authorization/default-authorization.provider';
import { ReassignCaseChannels } from './reassign-case-channels';
import { TabReassignCaseDataKeys } from './tab/state/reassign-case-tab-data-keys';
import { ReassignSelectedCasesDelegate } from './delegates/reassign-selected-cases.delegate';
import { ReassignAllCasesDelegate } from './delegates/reassign-all-cases.delegate';
import { ReassignCaseFilterModel } from './filter/reassign-case-filter.model';
import { ReassignCaseListItemsDelegate } from './delegates/reassign-case-list-items.delegate';
import { ReassignCaseDialogDelegate } from './delegates/reassign-case-dialogs.delegate';
import { ReassignCaseGridComponent } from './grid/reassign-case-grid.component';
import { ReassignCaseBaseDelegate } from './delegates/reassign-case.base.delegate';

@Component({
    selector: 'reassign-case',
    templateUrl: './reassign-case.component.html',
    styleUrls: ['./reassign-case.component.css'],
    providers: [
        ReassignSelectedCasesDelegate,
        ReassignAllCasesDelegate,
        ReassignCaseListItemsDelegate,
        ReassignCaseDialogDelegate,
        ReassignCaseBaseDelegate,
        { provide: AuthorizationProvider, useClass: DefaultAuthorizationProvider }
    ]
})
export class ReassignCaseComponent extends PrimaryTabHostViewModel {
    public isGridVisible: boolean;
    public isToUsersListDisabled: boolean;
    public isReassignButtonDisabled: boolean;
    public reassignFromUsersList: ListDataItem[];
    public reassignToUsersList: ListDataItem[];
    public reassignCaseFilter: ReassignCaseFilterModel;
    public selectedPolicies: PolicyProxyDTO[];

    @ViewChild(ReassignCaseGridComponent)
    private _reassignCaseGridViewComponent: ReassignCaseGridComponent;
    private _reassignSelectedCasesDelegate: ReassignSelectedCasesDelegate;
    private _reassignCaseListItemsDelegate: ReassignCaseListItemsDelegate;
    private _reassignAllCasesDelegate: ReassignAllCasesDelegate;
    private _reassignCaseDialogDelegate: ReassignCaseDialogDelegate;
    private _messagingService: MessagingService;
    private _fromUserID: number;
    private _toUserID: number;
    private _filtersStateValueAccessor: TabStateValueAccessor<ReassignCaseFilterModel>;

    constructor(
        injector: Injector,
        tabStateManager: TabStateManager,
        messagingService: MessagingService,
        reassignSelectedCasesDelegate: ReassignSelectedCasesDelegate,
        reassignAllCasesDelegate: ReassignAllCasesDelegate,
        reassignCaseListItemsDelegate: ReassignCaseListItemsDelegate,
        reassignCaseDialogDelegate: ReassignCaseDialogDelegate
    ) {
        super(injector);
        this._messagingService = messagingService;
        this._reassignSelectedCasesDelegate = reassignSelectedCasesDelegate;
        this._reassignAllCasesDelegate = reassignAllCasesDelegate;
        this._reassignCaseListItemsDelegate = reassignCaseListItemsDelegate;
        this._reassignCaseDialogDelegate = reassignCaseDialogDelegate;

        this.reassignToUsersList = new Array<ListDataItem>();
        this.selectedPolicies = [];
        this.createStateValueAccessors(tabStateManager);
    }

    public loadData(): Promise<void> {
        this.initFilters();
        this.setResolvedListData();
        this.isReassignFromUserValid();
        return Promise.resolve();
    }

    protected setupData(): void {
        this.updateReassignToUserListDisability();
        this.updateReassignButtonsDisability();
    }

    public maintainState(): void {
        this.setGridVisibility(true);
        this.setFromUserID(this.reassignCaseFilter.fromUser);
        this.publishReassignCaseFilterModel();
        this.setReassignToUsersList();
        this.setToUserID(this.reassignCaseFilter.toUser);
        this.updateReassignToUserListDisability();
        this.updateReassignButtonsDisability();
    }

    public ngOnDestroy(): void {
        if (this._messagingService.channelExist(ReassignCaseChannels.ReassignFromChange)) {
            this._messagingService.closeChannel(ReassignCaseChannels.ReassignFromChange);
        }
        if (this.reassignCaseFilter.fromUser) {
            this._filtersStateValueAccessor.setValue(this.reassignCaseFilter);
        }
        super.ngOnDestroy();
    }

    public onReassignFromUserChange(reassignedFrom: any): void {
        if (this.reassignCaseFilter.fromUser) {
            this.setGridVisibility(true);
            this.setFromUserID(reassignedFrom.value);
            this.resetToUserValue();
            this.setReassignToUsersList();
            this.enableOrDisableToUserList(false);
            this.enableOrDisableReassignButtons(true);
            this.publishReassignCaseFilterModel();
        } else {
            this.resetView();
        }
    }

    public onReassignToUserChange(reassignToUser: ListItem): void {
        if (reassignToUser) {
            this.setToUserID(reassignToUser.value);
        }
        this.setReassignButtonsDisability(reassignToUser);
    }

    public reassignSelectedCases(): void {
        this.selectedPolicies = this._reassignCaseGridViewComponent.selectedPolicies;
        if (this.isSameUsersSelected()) {
            this._reassignCaseDialogDelegate.showSameUsersDialog();
        } else if (this.isNoCaseSelected()) {
            this._reassignCaseDialogDelegate.showNoCasesSelectedDialog();
        } else {
            this.reassignCases(this.getSelectedPolicyIDs());
        }
    }

    public reassignAllCases(): void {
        const rowCount = this._reassignCaseGridViewComponent.rowCount;
        if (this.isSameUsersSelected()) {
            this._reassignCaseDialogDelegate.showSameUsersDialog();
        } else if (rowCount < 1) {
            this._reassignCaseDialogDelegate.showNoCasesAvailableDialog();
        } else {
            this._reassignAllCasesDelegate.reassignCases(this._fromUserID, this._toUserID).then((result: boolean) => {
                if (result) {
                    this.resetView();
                }
            });
        }
    }

    private getSelectedPolicyIDs(): number[] {
        return this.selectedPolicies.map(policy => ConvertUtil.toNumber(policy.PolicyId));
    }

    private reassignCases(policyIDsList: number[]): void {
        this._reassignSelectedCasesDelegate
            .reassignToUser(this._fromUserID, this._toUserID, policyIDsList)
            .then((result: boolean) => {
                if (result) {
                    this.resetView();
                }
            });
    }

    private resetFromUserValue(): void {
        this.reassignCaseFilter.fromUser = '';
    }

    private resetToUserValue(): void {
        this.reassignCaseFilter.toUser = '';
    }

    private enableOrDisableToUserList(value: boolean): void {
        this.isToUsersListDisabled = value;
    }

    private setFromUserID(userId: string): void {
        this._fromUserID = ConvertUtil.toNumber(userId);
    }

    private setToUserID(userId: string): void {
        this._toUserID = ConvertUtil.toNumber(userId);
    }

    private setGridVisibility(value: boolean): void {
        this.isGridVisible = value;
    }

    private createStateValueAccessors(tabStateManager: TabStateManager): any {
        this._filtersStateValueAccessor = new TabStateValueAccessor<ReassignCaseFilterModel>(
            tabStateManager,
            TabReassignCaseDataKeys.REASSIGN_FILTERS
        );
    }

    private initFilters(): void {
        this.reassignCaseFilter = this._filtersStateValueAccessor.hasValue()
            ? this._filtersStateValueAccessor.getValue()
            : new ReassignCaseFilterModel();
    }

    private isReassignFromUserValid(): void {
        if (this._filtersStateValueAccessor.hasValue() && this.reassignCaseFilter.fromUser !== '') {
            this.maintainState();
        }
    }

    private updateReassignToUserListDisability(): void {
        const isFromUserAvailable = !!this.reassignCaseFilter.fromUser;
        this.enableOrDisableToUserList(!isFromUserAvailable);
    }

    private updateReassignButtonsDisability(): void {
        const isToUserAvailable = !!this.reassignCaseFilter.toUser;
        this.enableOrDisableReassignButtons(!isToUserAvailable);
    }

    private publishReassignCaseFilterModel(): any {
        this._messagingService.publish(ReassignCaseChannels.ReassignFromChange, this.reassignCaseFilter);
    }

    private setReassignButtonsDisability(reassignToUser: any): void {
        const isReassignToUserAvailable = reassignToUser && reassignToUser.value;
        this.enableOrDisableReassignButtons(!isReassignToUserAvailable);
    }

    private isSameUsersSelected(): boolean {
        return this._fromUserID === this._toUserID;
    }

    private isNoCaseSelected(): boolean {
        return this.selectedPolicies.length < 1;
    }

    private resetView(): void {
        this.resetFromUserValue();
        this.resetToUserValue();
        this.resetReassignToUsersList();
        this.enableOrDisableToUserList(true);
        this.enableOrDisableReassignButtons(true);
        this.setGridVisibility(false);
    }

    private enableOrDisableReassignButtons(value: boolean): void {
        this.isReassignButtonDisabled = value;
    }

    private resetReassignToUsersList(): void {
        this.reassignToUsersList = [];
    }

    private setReassignToUsersList(): void {
        this._reassignCaseListItemsDelegate.getData(this._fromUserID).then(response => {
            this.reassignToUsersList = response.uwOrSaUserId;
        });
    }
}
