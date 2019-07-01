import { Component, Injector, ViewChild } from '@angular/core';
import {
    IDataGridViewModel,
    IDataGridOptions,
    DataGridColumns,
    DataGridOptionsUtil,
    DataGrid,
    DataGridCommonOptions
} from 'life-core/component/grid';
import { ViewModel, ParentChildRegistry } from 'life-core/view-model';
import { ICompose, DialogButton, DialogResult } from 'life-core/component';
import {
    IDialogViewModel,
    DialogData,
    DialogViewModelResult,
    ConfirmDialog,
    DialogButtonType
} from 'life-core/component/dialog';
import { AuthorizationProvider } from 'life-core/authorization';
import { I18n } from 'life-core/i18n';

import { CoverageValidationGridColumnsBuilder } from './coverage-validation-grid-columns.builder';
import { Prompt } from 'business/policy/shared';
import { ValidationMessageType } from './validation-message.type';
import { CoverageAuthorizationProvider } from '../../coverage-authorization.provider';

@Component({
    selector: 'coverage-validation',
    templateUrl: './coverage-validation.component.html',
    providers: [
        ParentChildRegistry,
        CoverageValidationGridColumnsBuilder,
        { provide: AuthorizationProvider, useClass: CoverageAuthorizationProvider }
    ]
})
export class CoverageValidationComponent extends ViewModel implements ICompose, IDialogViewModel, IDataGridViewModel {
    public gridOptions: IDataGridOptions;
    public rowCount: number;
    private _gridColumnsBuilder: CoverageValidationGridColumnsBuilder;
    private _validationMessages: Prompt[];
    private _confirmDialog: ConfirmDialog;

    @ViewChild(DataGrid)
    public refDataGrid: DataGrid;

    constructor(
        injector: Injector,
        gridColumnsBuilder: CoverageValidationGridColumnsBuilder,
        confirmDialog: ConfirmDialog,
        i18n: I18n
    ) {
        super(injector);
        this._gridColumnsBuilder = gridColumnsBuilder;
        this._confirmDialog = confirmDialog;
        this.i18n = i18n;
    }

    public setModel(model: DialogData): void {
        this._validationMessages = model.parameterData;
    }

    public loadData(): Promise<void> {
        this.gridOptions = this.getGridOptions();
        return Promise.resolve(null);
    }

    protected setupData(): void {
        this.rowCount = this._validationMessages.length;
    }

    public getGridOptions(): IDataGridOptions {
        const gridColumns: DataGridColumns = this.getGridColumns();
        return DataGridOptionsUtil.getGridOptions(
            {
                rowData: this._validationMessages,
                columnDefs: gridColumns.getLayout(),
                rowSelection: 'multiple',
                rowDeselection: true,
                enableColResize: true,
                enableSorting: true,
                headerRows: 2,
                context: {
                    hostComponent: this
                }
            },
            DataGridCommonOptions
        );
    }
    public getGridColumns(): DataGridColumns {
        return this._gridColumnsBuilder.build();
    }

    public onDialogButtonClick(buttonId: string): Promise<DialogViewModelResult> {
        if (buttonId == DialogButtonType.CONTINUE) {
            if (this.canContinueToChangeDisposition()) {
                return Promise.resolve(
                    new DialogViewModelResult({ validationMessages: this._validationMessages }, true)
                );
            }
            this.showDispositionChangeValidationMessage();
        } else {
            return Promise.resolve(new DialogViewModelResult({ validationMessages: null }, true));
        }
    }

    private canContinueToChangeDisposition(): boolean {
        return this.isRequiredValidationMessagesNotPresent() && this.isOverridableValidationMessagesChecked();
    }

    private isRequiredValidationMessagesNotPresent(): boolean {
        return this._validationMessages.find(message => message.Type == ValidationMessageType.Required) == undefined;
    }

    private isOverridableValidationMessagesChecked(): boolean {
        return (
            this._validationMessages.find(
                message => message.Type == ValidationMessageType.Overridable && message.Checked == false
            ) == undefined
        );
    }

    private showDispositionChangeValidationMessage(): Promise<DialogResult> {
        return this._confirmDialog.open({
            message: this.i18n({
                value: 'The messages needs to be addressed before continuing to change the coverage disposition.',
                id: 'policy.worksheet.coverageValidationFailed.alertmsg'
            }),
            title: this.i18n({
                value: 'Coverage Validation Failed',
                id: 'policy.worksheet.coverageValidationFailed.title'
            }),
            buttons: [new DialogButton({ type: DialogButtonType.OK })]
        });
    }

    public onRowSelected(selectedMessage: any): void {
        const overridableMessage = this._validationMessages.find(
            message => message.Type == selectedMessage.data.Type && message.Message == selectedMessage.data.Message
        );
        overridableMessage.Checked = selectedMessage.node.selected;
    }
}
