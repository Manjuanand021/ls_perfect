import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { IViewModel } from 'life-core/view-model';

/**
 * This deactivation guard resets Angular form, including its 'dirty' state.
 * Use this guard with top-level ViewModels connected to the left menu
 * to reset Angular form's 'dirty' state after current ViewModel is saved.
 *
 * Note that only the top-most ViewModels should use this guard, as resettng the form
 * will clear all controls of the form, including the ones that belong
 * to parent ViewModels of the current ViewModel.
 *
 */
export class ResetFormDeactivateGuard implements CanDeactivate<IViewModel> {
    public canDeactivate(
        target: IViewModel,
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Promise<boolean> {
        this.scheduleNgFormReset(target);
        return Promise.resolve(true);
    }

    private scheduleNgFormReset(viewModel: IViewModel): void {
        const ngForm = viewModel.getRootForm();
        // if (ngForm && ngForm.dirty) {
        if (ngForm) {
            viewModel.getViewValidator().scheduleFormReset();
        }
    }
}
