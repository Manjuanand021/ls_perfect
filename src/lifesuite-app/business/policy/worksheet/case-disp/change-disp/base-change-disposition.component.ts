import { Injector } from '@angular/core';

import { ViewModel, ViewValidationResult } from 'life-core/view-model';
import {
    ICompose,
    IDialogViewModel,
    DialogViewModelResult,
    DialogData,
    DialogButtonType,
    DialogResult,
    DialogButton,
    ConfirmDialog
} from 'life-core/component';
import { I18n } from 'life-core/i18n';

import { ListDataService, DataService, ListsDataRequest } from 'ls-core/service';

export abstract class BaseChangeDispositionComponent<T> extends ViewModel<T> implements ICompose, IDialogViewModel {
    protected listDataService: ListDataService;
    protected dataService: DataService;
    public cancelOpenRequirementsExist: boolean;
    public cancelOpenRequirementsValue: string;
    public resolvedData: any;
    public filteredReasonList: Array<any>;
    private _confirmDialog: ConfirmDialog;

    constructor(injector: Injector, i18n: I18n) {
        super(injector);
        this.i18n = i18n;
        this.listDataService = injector.get(ListDataService);
        this.dataService = injector.get(DataService);
        this._confirmDialog = injector.get(ConfirmDialog);
    }

    public ngAfterContentInit(): void {
        super.ngAfterContentInit();
        this.resetCancelOpenRequirements();
    }

    public setModel(model: DialogData): void {
        this.resolvedData = model.resolvedData;
    }

    public onDialogButtonClick(buttonId: string): Promise<DialogViewModelResult> {
        if (buttonId == DialogButtonType.SAVE) {
            return this.validate().then(result => {
                if (result == ViewValidationResult.pass) {
                    return this.setDisposition();
                } else {
                    return new DialogViewModelResult(null, false);
                }
            });
        }
        return this.resetDispositionData();
    }

    public onDispositionChange(caseDispositionSelection: any): void {
        this.resetReasonText();
        this.reloadReasonList(caseDispositionSelection);
        this.setCancelOpenRequirementsFlag();
        this.resetCancelOpenRequirements();
    }

    protected abstract isCancelOpenRequirementOptionAvailable(): boolean;

    protected abstract resetReasonText(): void;

    protected abstract getReasonListDataRequest(): ListsDataRequest;

    protected abstract setDisposition(): Promise<DialogViewModelResult>;

    protected abstract resetDispositionData(): Promise<DialogViewModelResult>;

    protected showDispositionErrorMessage(errorMessage: string): Promise<DialogResult> {
        return this._confirmDialog.open({
            message: errorMessage,
            title: this.i18n({
                value: 'Message from webpage',
                id: 'policy.worksheet.coverage.changeDisposition.title'
            }),
            buttons: [new DialogButton({ type: DialogButtonType.OK })]
        });
    }

    protected onDataSet(): void {
        this.setCancelOpenRequirementsFlag();
    }

    private setCancelOpenRequirementsFlag(): void {
        this.cancelOpenRequirementsExist = this.isCancelOpenRequirementOptionAvailable();
    }

    private resetCancelOpenRequirements(): void {
        this.cancelOpenRequirementsValue = '';
    }

    private reloadReasonList(caseDispositionSelection: Event): void {
        const request = this.getReasonListDataRequest();
        this.listDataService.load(request).then(data => {
            this.filteredReasonList = data.ReasonText;
        });
    }
}
