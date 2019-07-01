import { Component, Input, ViewChildren, ViewChild } from '@angular/core';

import { LfButton, LfSplitButton } from 'life-core/component/button';
import { PopoverDialog } from 'life-core/component';

import { ToolbarButton } from './toolbar.model';

@Component({
    selector: 'lf-toolbar',
    templateUrl: './toolbar.html'
})
export class LfToolbar {
    @Input()
    public style: any;

    @Input()
    public styleClass: string;

    @Input()
    public buttons: Array<ToolbarButton>;

    @ViewChildren(PopoverDialog)
    private _popovers: PopoverDialog[];

    @ViewChildren(LfButton)
    private _buttonComponents: LfButton[];

    @ViewChildren(LfSplitButton)
    private _splitButtonComponents: LfSplitButton[];

    constructor() {
        this.buttons = [];
    }

    public item(index: number): ToolbarButton {
        return this.buttons[index];
    }

    public length(): number {
        return this.buttons.length;
    }

    public getButton(id: string): LfButton {
        return this._buttonComponents.find(button => button.id == id);
    }

    public getSplitButton(id: string): LfSplitButton {
        return this._splitButtonComponents.find(splitButton => splitButton.id == id);
    }

    protected getPopoverDialogById(id: string): PopoverDialog {
        return this._popovers.find(popover => popover.popoverParams != undefined && popover.popoverParams.id === id);
    }
}
