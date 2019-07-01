import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { IViewModel } from 'life-core/view-model';
import { INavigableViewValidationStrategy } from 'lpla-core/view-model';
import { ViewValidationResult } from 'life-core/view-model';
import { SaveDataResult } from 'life-core/service';

export class CanDeactivateGuard implements CanDeactivate<IViewModel> {
    canDeactivate(target: IViewModel, route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        return target.validate().then(validationResult => {
            (<INavigableViewValidationStrategy>target.getViewValidationStrategy()).resetNavigationType();
            if (validationResult == ViewValidationResult.pass) {
                return target.saveData().then(saveDataResult => {
                    return saveDataResult == SaveDataResult.success;
                });
            } else {
                return false;
            }
        });
    }
}
