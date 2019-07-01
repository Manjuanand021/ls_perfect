import { Inject, Injectable } from '@angular/core';

import { MenuItem } from 'life-core/component/menu';
import { ToolBarElement, ToolBarLinkData } from './toolbar-element';
import { ToolbarButton } from './toolbar.model';
import {
    ToolbarPopoverDialogParamsMapType,
    TOOLBAR_POPOVER_DIALOG_PARAMS_MAP
} from './toolbar-popover-dialog-params.map';

@Injectable()
export class ToolBarButtonFactory {
    private _toolbarPopoverDialogParamsMap: ToolbarPopoverDialogParamsMapType;
    constructor(
        @Inject(TOOLBAR_POPOVER_DIALOG_PARAMS_MAP) toolbarPopoverDialogParamsMap: ToolbarPopoverDialogParamsMapType
    ) {
        this._toolbarPopoverDialogParamsMap = toolbarPopoverDialogParamsMap;
    }

    public newItem(
        toolBarItem: ToolBarElement,
        isSplitButton: boolean,
        toolBarButtonClickHandler: (
            {
                action,
                event,
                labelValue
            }: {
                action: string;
                event?: Event;
                labelValue?: string;
            }
        ) => void
    ): ToolbarButton {
        const newToolBarButton = new ToolbarButton({
            id: toolBarItem['name'],
            type: isSplitButton ? 'split_button' : 'button',
            title: toolBarItem['tooltip'],
            // label: toolBarItem['tooltip'],
            visible: toolBarItem['visible'],
            disabled: !toolBarItem['enabled'],
            icon: `toolbar-button-medium button-${toolBarItem['name']}`,
            onClick: event => toolBarButtonClickHandler({ action: toolBarItem['action'], event: event }),
            model: isSplitButton ? this.createMenuItems(toolBarItem, toolBarButtonClickHandler) : undefined
        });
        this.setPopoverDialogParams(newToolBarButton);
        return newToolBarButton;
    }

    private createMenuItems(
        toolBarItem: ToolBarElement,
        toolBarButtonClickHandler: (
            {
                action,
                event,
                labelValue
            }: {
                action: string;
                event?: Event;
                labelValue?: string;
            }
        ) => void
    ): MenuItem[] {
        const menuItems: MenuItem[] = [];
        toolBarItem['links'].forEach((linkData: ToolBarLinkData) => {
            menuItems.push(
                new MenuItem({
                    id: linkData['action'],
                    label: linkData['label'],
                    command: event =>
                        toolBarButtonClickHandler({ action: linkData['action'], labelValue: linkData['labelValue'] })
                })
            );
        });
        return menuItems;
    }

    private setPopoverDialogParams(button: ToolbarButton): void {
        button.popoverParams = this._toolbarPopoverDialogParamsMap[button.id];
    }
}
