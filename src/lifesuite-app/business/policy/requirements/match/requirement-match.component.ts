import { Component, Injector } from '@angular/core';

import { ParentChildRegistry } from 'life-core/view-model';
import { ListItem } from 'life-core/model';
import {
    ICompose,
    IDialogViewModel,
    DialogViewModelResult,
    DialogData,
    DialogButtonType,
    DialogButton,
    DialogResult
} from 'life-core/component';
import { DataGridColumns, BaseInfiniteGridViewModel } from 'life-core/component/grid';
import { AuthorizationProvider } from 'life-core/authorization';
import { TabStateManager } from 'life-core/util';
import { I18n } from 'life-core/i18n';

import { MVRProxy, RequirementDTO, PolicyDTO } from 'ls-core/model';
import { AppSession } from 'ls-core/session';

import { GridDataStateKeys } from 'business/shared/grid';

import { RequirementMatchGridColumnsBuilder } from './requirement-match-grid-columns.builder';
import { RequirementMatchGridDataSource } from './datasource/requirement-match-grid-datasource';
import { RequirementMatchUnmatchChannels, MatchUnmatchType } from './requirement-match-unmatch.type';
import { RequirementsAuthorizationProvider } from '../requirements-authorization.provider';
import { RequirementFilterModel } from './requirement-filter.model';
import { RequirementTypes } from '../requirement.type';

@Component({
    selector: 'requirement-match',
    templateUrl: './requirement-match.component.html',
    providers: [
        ParentChildRegistry,
        TabStateManager,
        RequirementMatchGridDataSource,
        RequirementMatchGridColumnsBuilder,
        { provide: AuthorizationProvider, useClass: RequirementsAuthorizationProvider }
    ]
})
export class RequirementMatchComponent extends BaseInfiniteGridViewModel<RequirementDTO>
    implements ICompose, IDialogViewModel {
    public viewListOptions: Array<ListItem>;

    protected i18n: I18n;

    private _selectedEvidence: MVRProxy;
    private _requirement: RequirementDTO;
    private _policy: PolicyDTO;
    private _requirementTypes: RequirementTypes;

    constructor(
        injector: Injector,
        gridDataSource: RequirementMatchGridDataSource,
        gridColumnsBuilder: RequirementMatchGridColumnsBuilder,
        i18n: I18n,
        requirementTypes: RequirementTypes,
        appSession: AppSession
    ) {
        super(injector, gridDataSource, gridColumnsBuilder);
        this.i18n = i18n;
        this._policy = appSession.policyDTO;
        this.filterModel = new RequirementFilterModel();
        this._requirementTypes = requirementTypes;
    }

    public setModel(model: DialogData): void {
        this._requirement = model.parameterData;
    }

    public getGridColumns(): DataGridColumns {
        return this.getGridColumnsBuilder().build(this._requirement.requirementType);
    }

    public onViewChange(): void {
        this.onFilterModelReceived();
    }

    public onRowClicked($event: any): void {
        super.onRowClicked($event);
        this._selectedEvidence = $event.node.data;
    }

    public onRowDoubleClicked($event: any): void {
        this._selectedEvidence = $event.node.data;
    }

    public onDialogButtonClick(buttonId: string): Promise<DialogViewModelResult> {
        if (buttonId === DialogButtonType.ACCEPT && this.isMatchSelected()) {
            this.changeManager.setIsDirty(true);
            if (this.isMatchExpired()) {
                return this.handleExpiredRequirementMatch();
            } else {
                return this.saveMatchedEvidence();
            }
        } else if (buttonId === DialogButtonType.ACCEPT && !this.isMatchSelected()) {
            this.showNoRowSelectedDialog(
                this.i18n({ value: 'Please select a match.', id: 'component.requirementmatch.dialog.selectmatch' }),
                this.i18n({ value: 'Error', id: 'component.requirementmatch.dialog.error' })
            );
            return Promise.resolve(new DialogViewModelResult(null, false, false));
        }
        return Promise.resolve(null);
    }

    protected setupData(): void {
        this.initViewListOptions();
        this.setDefaultView();
        this.updateFilter();
    }

    protected updateFilter(filterModel?: RequirementFilterModel): void {
        this.filterModel.requirementType = this._requirement.requirementType;
        super.updateFilter(this.filterModel);
    }

    protected registerFilterChangeHandlers(): void {}

    protected getGridStateKey(): string {
        return GridDataStateKeys.REQUIREMENT_MATCH;
    }

    // no implementation needed
    protected rowDataMatch(rowData1: RequirementDTO, rowData2: RequirementDTO): boolean {
        return false;
    }

    // no implementation needed
    protected openSelectedGridRow(): void {}

    private initViewListOptions(): void {
        // List options are being made in UI as the same thing is done in Flex
        this.viewListOptions = [];
        this.viewListOptions.push(new ListItem('All Records', 'All Records'));
        this.viewListOptions.push(new ListItem('All Unexpired', 'All Unexpired'));
        this.viewListOptions.push(new ListItem('Past 365 Days', 'Past 365 Days'));
    }

    private setDefaultView(): void {
        this.filterModel.selectedView = 'All Unexpired';
    }

    private isMatchSelected(): boolean {
        return this._selectedEvidence !== undefined;
    }

    private handleExpiredRequirementMatch(): Promise<DialogViewModelResult> {
        return this.showMatchExpiredDialog().then(dialogRef => {
            if (dialogRef.buttonId === DialogButtonType.OK) {
                return this.saveMatchedEvidence();
            } else {
                return Promise.resolve(new DialogViewModelResult(null, false, false));
            }
        });
    }

    private saveMatchedEvidence(): Promise<DialogViewModelResult> {
        this._requirement.RequirementInformationId = this._selectedEvidence.RequirementInformationId;
        this.publishMatchSelection();
        return Promise.resolve(new DialogViewModelResult(null, true, false));
    }

    private isMatchExpired(): boolean {
        return new Date(this._selectedEvidence.ExpirationDate.datetime) <= new Date();
    }

    private showMatchExpiredDialog(): Promise<DialogResult> {
        return this.confirmDialog.open({
            message: this.i18n(
                {
                    value:
                        'The selected {{requirementType}} has expired. Do you still wish to match it to this requirement?',
                    id: 'component.requirementmatchexpired.dialog.error'
                },
                { requirementType: this._requirement.requirementType }
            ),
            title:
                this._requirement.requirementType === 'MVR' ? this._requirementTypes.mvr : this._requirementTypes.lab,
            buttons: [
                new DialogButton({ type: DialogButtonType.OK }),
                new DialogButton({ type: DialogButtonType.CANCEL })
            ]
        });
    }

    private publishMatchSelection(): void {
        const requirement = this._policy.Requirements_LazyLoad.find(
            requirements => requirements.RequirementCode === this._requirement.RequirementCode
        );
        requirement.RequirementInformationId = this._selectedEvidence.RequirementInformationId;

        this.messagingService.publish(RequirementMatchUnmatchChannels.RequirementMatchUnmatch, {
            requirement: requirement,
            matchUnmatchType: MatchUnmatchType.Match
        });
    }
}
