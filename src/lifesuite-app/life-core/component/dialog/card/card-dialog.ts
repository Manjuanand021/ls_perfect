import {
    Component,
    Injector,
    Input,
    Type,
    ViewEncapsulation,
    EventEmitter,
    Output,
    ViewChild,
    forwardRef
} from '@angular/core';

import { Compose } from 'life-core/component/compose';
import { DirectDataResolve, DirectResolvedData, resolveData } from 'life-core/component/shared';
import { ISecureComponent, AuthorizationUtil, SecureComponent } from 'life-core/component/authorization';
import { AuthorizationLevel } from 'life-core/authorization';
import { LangUtil } from 'life-core/util/lang';

import { DialogButton } from '../shared/dialog-button';
import { DialogButtonLabels } from '../shared/dialog-button-labels';
import {
    DialogData,
    DialogResult,
    DialogViewModelResult,
    IDialogViewModel,
    DialogParams
} from '../shared/dialog.interface';

@Component({
    selector: 'card-dialog',
    templateUrl: './card-dialog.html',
    styleUrls: ['../shared/dialog.css', './card-dialog.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [{ provide: SecureComponent, useExisting: forwardRef(() => CardDialog) }]
})
export class CardDialog implements ISecureComponent {
    public title: string;
    public data: DialogData;
    public buttons: DialogButton[];

    @Input()
    public name: string;

    @Input()
    public view: Type<any>;

    @ViewChild(Compose)
    protected refCompose: Compose;

    @Output()
    public dialogDismiss: EventEmitter<void> = new EventEmitter<void>();

    private _injector: Injector;
    private _authorizationLevel: AuthorizationLevel;
    private _disabled: boolean;
    private _dialogButtonLabels: DialogButtonLabels;

    constructor(injector: Injector, dialogButtonLabels: DialogButtonLabels) {
        this._injector = injector;
        this._dialogButtonLabels = dialogButtonLabels;
    }

    // Component Authorization
    @Input()
    public set authorizationLevel(value: AuthorizationLevel) {
        this._authorizationLevel = value;
        this.updateDisabled(this._disabled);
    }

    public get authorizationLevel(): AuthorizationLevel {
        return this._authorizationLevel;
    }

    @Input()
    public set disabled(value: boolean) {
        this.updateDisabled(value);
    }

    public get disabled(): boolean {
        return this._disabled;
    }

    public open(params: CardDialogParams): Promise<void> {
        if (params.resolve) {
            return resolveData(params.resolve, this._injector).then(resolvedData => {
                params.resolvedData = resolvedData;
                return this.openDialog(params);
            });
        } else {
            return Promise.resolve(this.openDialog(params));
        }
    }

    public close(): void {}

    public onButtonClick(button: DialogButton): void {
        this.getContentComponent<IDialogViewModel>()
            .onDialogButtonClick(button.type)
            .then(dialogViewModelResult => {
                if (!dialogViewModelResult) {
                    dialogViewModelResult = new DialogViewModelResult();
                }
                const closeDialog: boolean = dialogViewModelResult.closeDialog === false ? false : true;
                const dialogDirty: boolean = !!dialogViewModelResult.dialogDirty;
                const dialogResult = new CardDialogResult(
                    button.type,
                    dialogViewModelResult.returnValue,
                    dialogDirty,
                    closeDialog
                );
                if (button.handler) {
                    this.invokeButtonHandler(button, dialogResult);
                }
            });
    }

    public onCloseClick(): void {
        this.dialogDismiss.emit();
    }

    public getContentComponent<T>(): T {
        return this.refCompose.component as T;
    }

    protected updateDisabled(value: boolean): void {
        this._disabled = !AuthorizationUtil.isLayoutComponentEnabled(this._authorizationLevel) ? true : value;
    }

    private openDialog(params: CardDialogParams): void {
        this.setupDialog(params);
    }

    private setupDialog(params: CardDialogParams): void {
        this.data = new DialogData(params.data, params.resolvedData);
        this.title = params.title;
        this.buttons = this.setupButtons(params.buttons);
    }

    private setupButtons(buttons: DialogButton[]): DialogButton[] {
        for (const button of buttons) {
            this.setupButton(button);
        }
        return buttons;
    }

    private setupButton(button: DialogButton): void {
        if (!button.label) {
            button.label = this._dialogButtonLabels.byType[button.type];
        }
    }

    protected invokeButtonHandler(button: DialogButton, returnValue: CardDialogResult): Promise<void> {
        if (LangUtil.isPromise(<any>button.handler)) {
            return button.handler(returnValue);
        } else {
            button.handler(returnValue);
            return Promise.resolve();
        }
    }
}

export interface CardDialogParams extends DialogParams {
    data?: any;
    resolve?: Array<DirectDataResolve>;
    resolvedData?: DirectResolvedData;
}

export class CardDialogResult extends DialogResult {
    public closeDialog?: boolean;

    constructor(buttonId?: string, returnValue?: any, isDialogDirty?: boolean, closeDialog?: boolean) {
        super(buttonId, returnValue, isDialogDirty);
        this.closeDialog = closeDialog;
    }
}
