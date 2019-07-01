import { Injectable, Type } from '@angular/core';

import {
    ToolbarButton,
    ToolBarElement,
    ToolBarButtonData,
    ToolBarDropdownData,
    ToolBarSeparator,
    ToolBarButtonFactory
} from 'life-core/component/toolbar';

type ToolBarButtonTypeMap = Map<string, Type<ToolBarElement>>;
const ToolBarButtonTypeMap: ToolBarButtonTypeMap = new Map<string, Type<ToolBarElement>>();
ToolBarButtonTypeMap.set('life.common.toolBar.ToolBarButtonData, UICommon', ToolBarButtonData);
ToolBarButtonTypeMap.set('life.common.toolBar.ToolBarDropdownData, UICommon', ToolBarDropdownData);
ToolBarButtonTypeMap.set('life.common.toolBar.ToolBarSeparator, UICommon', ToolBarSeparator);

@Injectable()
export class ToolBarSetupDelegate {
    private _toolBarButtonFactory: ToolBarButtonFactory;
    constructor(toolBarButtonFactory: ToolBarButtonFactory) {
        this._toolBarButtonFactory = toolBarButtonFactory;
    }

    public setup(
        linkItems: ToolBarElement[],
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
    ): ToolbarButton[] {
        const toolbarButtons: ToolbarButton[] = [];
        linkItems.forEach((toolBarItem: ToolBarElement) => {
            const toolBarButton = this._toolBarButtonFactory.newItem(
                toolBarItem,
                this.isSplitButton(toolBarItem),
                toolBarButtonClickHandler
            );
            toolbarButtons.push(toolBarButton);
        });
        return toolbarButtons;
    }

    private isSplitButton(toolBarItem: ToolBarElement): boolean {
        return ToolBarButtonTypeMap.get(toolBarItem['$type']) === ToolBarDropdownData;
    }
}
