import { Injectable, Injector } from '@angular/core';

import { ConfirmDialog, DialogButton, DialogButtonType } from 'life-core/component/dialog';

import { UIClientMappedException } from './client-error-logger.service';

@Injectable()
export class DisplayUIErrorDialogDelegate {
    private _confirmDialog: ConfirmDialog;
    private _injector: Injector;

    constructor(injector: Injector) {
        this._injector = injector;
    }

    public showError(exceptions: UIClientMappedException[]): void {
        const exception: UIClientMappedException = exceptions[0];
        if (exception.Message) {
            const errorMsg = exception.Message.trim().replace('contact to', 'contact your');
            this._confirmDialog = this._injector.get(ConfirmDialog);
            this._confirmDialog.open({
                message: errorMsg,
                // Don't use I18n here to avoid triggering LOCALE_ID injection before User is loaded
                title: 'Error',
                buttons: [new DialogButton({ type: DialogButtonType.OK, options: { isDefault: true } })]
            });
        }
    }
}
