import { ParentChildRegistry } from './parent-child-registry';
import { IViewModel } from '../view-model';
import { ViewModelUtil } from '../view-model.util';

/**
 * The registry class to keep relations between paren-child views on a page.
 */
export class ParentChildRegistryValidator {
    private _viewModel: IViewModel;

    constructor(viewModel: IViewModel) {
        this._viewModel = viewModel;
    }

    public isValidParentChildRegistry(parentChildRegistry: ParentChildRegistry): boolean {
        let isValid = parentChildRegistry != undefined;
        if (isValid) {
            if (ViewModelUtil.isDialogViewModel(this._viewModel)) {
                // Require ParentChildRegistry provider for Dialogs
                isValid = parentChildRegistry.root == undefined;
            }
        }
        return isValid;
    }
}
