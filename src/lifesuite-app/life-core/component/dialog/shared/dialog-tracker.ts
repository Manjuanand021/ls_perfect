import { Injectable } from '@angular/core';

import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
    providedIn: 'root'
})
export class DialogTracker {
    private _openedDialogs: NgbModalRef[];

    constructor() {
        this._openedDialogs = [];
    }

    public onDialogOpened(dialogRef: NgbModalRef): void {
        this._openedDialogs.push(dialogRef);
    }

    public onDialogClosed(dialogRef: NgbModalRef): void {
        this._openedDialogs.splice(this._openedDialogs.indexOf(dialogRef), 1);
    }

    public anyOpenedDialogs(): boolean {
        return this._openedDialogs.length > 0;
    }

    public closeAll(): void {
        for (let i = this._openedDialogs.length - 1; i >= 0; i--) {
            this._openedDialogs[i].close();
            this._openedDialogs.pop();
        }
    }

    public getParentDialog(dialogRef: NgbModalRef): NgbModalRef | undefined {
        const dialogIndex = this._openedDialogs.indexOf(dialogRef);
        return dialogIndex > 0 ? this._openedDialogs[dialogIndex - 1] : undefined;
    }
}
