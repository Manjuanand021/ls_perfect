import { Injector, Injectable } from '@angular/core';

import { ConfirmDialog, DialogButton, DialogButtonType } from 'life-core/component/dialog';
import { I18n } from 'life-core/i18n';

import { AppCloseChannel } from './application/close-app.interface';
import { SaveDataDelegate } from 'life-core/handler/save-data.delegate';

@Injectable()
export class SaveAndCloseDataDelegate extends SaveDataDelegate {
    protected confirmDialog: ConfirmDialog;

    constructor(injector: Injector, i18n: I18n) {
        super(injector, i18n);
        this.i18n = i18n;
    }

    protected getSaveDataChannelName(): string {
        return AppCloseChannel.CloseApplication;
    }

    protected onDataValidationFailed(): void {
        this.displayValidationFailWarningDialog();
    }

    protected displayValidationFailWarningDialog(): void {
        this.confirmDialog
            .open({
                message: this.getValidationFailWarningDialogMessage(),
                title: this.getWarningDialogTitle(),
                buttons: [
                    new DialogButton({ type: DialogButtonType.OK }),
                    new DialogButton({ type: DialogButtonType.CANCEL, options: { isDefault: true } })
                ]
            })
            .then(result => {
                const isOK = result.buttonId == DialogButtonType.OK;
                if (isOK) {
                    this.continueOnFail();
                } else {
                    this.cancelOnFail();
                }
            });
    }

    protected getValidationFailWarningDialogMessage(): string {
        return this.i18n({
            value: 'Data is invalid. Do you want to discard the changes you might have made and continue?',
            id: 'saveclose.validation.fail.message'
        });
    }
}
