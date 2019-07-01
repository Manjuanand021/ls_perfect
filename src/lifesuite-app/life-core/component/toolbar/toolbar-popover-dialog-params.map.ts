import { InjectionToken } from '@angular/core';

import { PopoverDialogParams } from 'life-core/component/dialog';

export type ToolbarPopoverDialogParamsMapType = { readonly [buttonType: string]: PopoverDialogParams };

export const TOOLBAR_POPOVER_DIALOG_PARAMS_MAP = new InjectionToken<ToolbarPopoverDialogParamsMapType>(
    'Toolbar.Popover.Dialog.Parameters.Map'
);
