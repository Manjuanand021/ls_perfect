import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { IViewModel } from '../view-model';
import { ViewValidationResult } from './view-validation.model';
import { SaveDataContext, SaveDataResult } from 'life-core/service';

/**
 * This deactivation guard validates and saves ViewModel's data.
 * Use this guard with top-level ViewModels connected to left menu
 * to save ViewModel data when user navigates left menu.
 */
export class CanDeactivateGuard implements CanDeactivate<IViewModel> {
    public canDeactivate(
        target: IViewModel,
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Promise<boolean> {
        if (target.componentTreeDeactivating) {
            return Promise.resolve(true);
        }
        return target.validate().then(validationResult => {
            // target.getViewValidationStrategy().resetNavigationType();
            if (validationResult == ViewValidationResult.pass) {
                return target.saveData(new SaveDataContext(true)).then(saveDataResult => {
                    return saveDataResult != SaveDataResult.fail;
                });
            } else {
                return false;
            }
        });
    }
}
