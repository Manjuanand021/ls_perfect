import { Component, Injector } from '@angular/core';

import { ViewModel } from 'life-core/view-model';
import { AppSession } from 'ls-core/session';
import { TabStateValueAccessor, TabStateManager } from 'life-core/util';
import { ConvertUtil } from 'life-core/util/lang';
import { IMessagingService, MessagingService } from 'life-core/messaging';
import { DropdownActionType } from 'life-core/component/input';

import { TabHomeDataKeys } from 'business/home/tab';
import { SummaryChannels } from 'business/home/summary/summary-channels';
import { SummaryFilterModel } from './summary-filter.model';

@Component({
    selector: 'summary-filter',
    templateUrl: './summary-filter.component.html'
})
export class SummaryFilterComponent extends ViewModel {
    public filters: SummaryFilterModel;
    public filterDropdownActionType: DropdownActionType = DropdownActionType.Presentation;

    private _appSession: AppSession;
    private _filtersStateValueAccessor: TabStateValueAccessor<SummaryFilterModel>;
    private _messagingService: IMessagingService;

    constructor(
        injector: Injector,
        appSession: AppSession,
        tabStateManager: TabStateManager,
        messagingService: MessagingService
    ) {
        super(injector);
        this._appSession = appSession;
        this.createStateValueAccessors(tabStateManager);
        this._messagingService = messagingService;
    }

    private createStateValueAccessors(tabStateManager: TabStateManager): void {
        this._filtersStateValueAccessor = new TabStateValueAccessor<SummaryFilterModel>(
            tabStateManager,
            TabHomeDataKeys.SUMMARY_FILTERS
        );
    }

    public loadData(): Promise<void> {
        this.initFilters();
        this.setResolvedListData();
        this.setDefaultUser();
        this.publishSummaryFilterModel();
        return Promise.resolve();
    }

    private initFilters(): void {
        this.filters = this._filtersStateValueAccessor.hasValue()
            ? this._filtersStateValueAccessor.getValue()
            : (this.filters = new SummaryFilterModel());
    }

    private setDefaultUser(): void {
        if (!this._filtersStateValueAccessor.hasValue()) {
            this.filters.selectedUser = ConvertUtil.toNumber(this._appSession.user.UserId);
        }
    }

    public onUserChange(userSelection: Event): void {
        this.publishSummaryFilterModel();
    }

    public onTeamChange(teamSelection: Event): void {
        this.publishSummaryFilterModel();
    }

    private publishSummaryFilterModel(): void {
        this._messagingService.publish(SummaryChannels.UserTeamChange, this.filters);
    }

    public ngOnDestroy(): void {
        this._messagingService.closeChannel(SummaryChannels.UserTeamChange);
        this._filtersStateValueAccessor.setValue(this.filters);
        super.ngOnDestroy();
    }
}
