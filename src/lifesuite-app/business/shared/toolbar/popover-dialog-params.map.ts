import { DialogButton, DialogButtonType } from 'life-core/component';
import { ViewValidationDialog } from 'life-core/view-model';
import { ToolbarPopoverDialogParamsMapType } from 'life-core/component/toolbar';

import { ToolbarPopoverDialogIds } from 'ls-core/component/toolbar';

import { ToolBarButtonType } from './toolbar-button-type';

export const lsPopoverDialogParamsMap: ToolbarPopoverDialogParamsMapType = {
    [ToolBarButtonType.VALIDATE]: {
        id: ToolbarPopoverDialogIds.VALIDATION,
        content: ViewValidationDialog,
        title: 'Validation Errors',
        triggers: 'manual',
        buttons: [new DialogButton({ type: DialogButtonType.OK })],
        autoClose: false
    }
};
