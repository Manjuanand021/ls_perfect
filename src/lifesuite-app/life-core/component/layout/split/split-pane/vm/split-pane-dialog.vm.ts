import { Injector } from '@angular/core';

import { ViewModel, ValidationRenderType, ViewValidationResult } from 'life-core/view-model';
import {
    CardDialog,
    CardDialogParams,
    CardDialogResult,
    DialogData,
    ICardDialogViewModel,
    DialogResult
} from 'life-core/component/dialog';
import { ICompose } from 'life-core/component/compose';
import { MessagingService } from 'life-core/messaging';
import { TabStateManager, TabStateValueAccessor } from 'life-core/util/tab-state';
import { I18n } from 'life-core/i18n';

import { SplitPaneArea } from '../lf-split-pane.model';
import { LfSplitPaneChannels } from '../lf-split-pane-channels';

export abstract class SplitPaneDialogViewModel extends ViewModel implements ICompose {
    public dialogData: DialogData;

    protected abstract cardDialog: CardDialog;
    protected i18n: I18n;

    protected splitArea: SplitPaneArea;
    protected messagingService: MessagingService;
    protected tabStateManager: TabStateManager;
    protected stateValueAccessor: TabStateValueAccessor<any>;
    private _dialogClosing: boolean = false;

    constructor(injector: Injector) {
        super(injector);
        this.messagingService = injector.get(MessagingService);
        this.tabStateManager = injector.get(TabStateManager);
        this.stateValueAccessor = this.createStateValueAccessor();
    }

    public ngAfterContentInit(): void {
        super.ngAfterContentInit();
        this.cardDialog.open(this.getDialogParams()).then(_ => {
            this.setupCardDialogData();
            this.dialogData = this.cardDialog.data;
        });
    }

    public setModel(model: any): void {
        this.splitArea = model as SplitPaneArea;
    }

    public getDialogComponent<TComp>(): TComp {
        return this.cardDialog.getContentComponent<TComp>();
    }

    public validate(validationRenderType?: ValidationRenderType): Promise<ViewValidationResult> {
        return this.getDialogComponent<ViewModel>().validate(validationRenderType);
    }

    public onDialogDismiss(e: Event): void {
        this.closeDialog();
    }

    protected closeDialog(dialogResult?: CardDialogResult): void {
        this.cardDialog.close();
        this._dialogClosing = true;
        this.messagingService.publish(
            LfSplitPaneChannels.RemoveSplitPaneArea,
            new SplitPaneResult(this.splitArea.id, dialogResult)
        );
    }

    protected onCardDialogButtonClick(dialogResult: CardDialogResult): void {
        if (dialogResult.closeDialog) {
            this.closeDialog(dialogResult);
        }
    }

    protected abstract getDialogParams(): CardDialogParams;

    protected onCardDialogOkClick(dialogResult: DialogResult): void {}

    private setupCardDialogData(): void {
        const stateData = this.stateValueAccessor.getValue();
        if (stateData) {
            this.restoreState(stateData);
        } else {
            this.initCardDialogData();
        }
    }

    private initCardDialogData(): void {
        this.getDialogComponent<ICardDialogViewModel>().initData();
    }

    // State Management

    protected abstract getStateValueKey(): string;

    private createStateValueAccessor(): TabStateValueAccessor<any> {
        return new TabStateValueAccessor<any>(this.tabStateManager, this.getStateValueKey());
    }

    private saveState(): void {
        this.stateValueAccessor.setValue(this.getDialogComponent<ICardDialogViewModel>().getState());
    }

    private restoreState(stateData: any): void {
        this.getDialogComponent<ICardDialogViewModel>().setState(stateData);
    }

    private deleteState(): void {
        this.stateValueAccessor.deleteValue();
    }

    public ngOnDestroy(): void {
        if (this._dialogClosing) {
            this.deleteState();
        } else {
            this.saveState();
        }
        super.ngOnDestroy();
    }
}

export class SplitPaneResult {
    public areaId: string;
    public dialogResult: DialogResult;

    constructor(areaId: string, dialogResult: DialogResult) {
        this.areaId = areaId;
        this.dialogResult = dialogResult;
    }
}
