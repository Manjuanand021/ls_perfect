import { Injectable } from '@angular/core';
import { IViewModel } from 'life-core/view-model';

@Injectable({
    providedIn: 'root'
})
export class FormResetScheduler {
    private _needFormReset: boolean = false;
    private _resetFromViewModel: IViewModel;

    public scheduleReset(resetFromViewModel: IViewModel): void {
        this._needFormReset = true;
        this._resetFromViewModel = resetFromViewModel;
    }

    public unscheduleReset(): void {
        this._needFormReset = false;
        this._resetFromViewModel = undefined;
    }

    public get resetScheduled(): boolean {
        return this._needFormReset;
    }

    public resetScheduledFromViewModel(viewModel: IViewModel): boolean {
        return this._needFormReset && viewModel == this._resetFromViewModel;
    }
}
