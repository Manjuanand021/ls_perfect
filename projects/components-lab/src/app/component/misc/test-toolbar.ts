import { Component } from '@angular/core';

import { MenuItem } from 'life-core/component/menu';
import { ToolbarButton } from 'life-core/component/toolbar';

@Component({
    selector: 'test-toolbar',
    templateUrl: './test-toolbar.html'
})
export class TestToolbar {
    splitButtonItems: MenuItem[] = [
        { id: 'idNew', label: 'New', command: event => this.onSplitButtonMenuClick(event) },
        { id: 'idOpen', label: 'Open', command: event => this.onSplitButtonMenuClick(event) }
    ];

    toolbarButtons: ToolbarButton[] = [
        new ToolbarButton({
            id: 'idToolbarButton1',
            type: 'button',
            label: 'OK',
            title: 'OK',
            icon: 'fa-check',
            styleClass: 'ui-button-success',
            onClick: event => this.onButtonClick(event)
        }),
        new ToolbarButton({
            id: 'idToolbarButton2',
            type: 'button',
            title: 'Cancel',
            icon: 'fa-times',
            onClick: event => this.onButtonClick(event)
        }),
        new ToolbarButton({
            id: 'idToolbarButton3',
            type: 'split_button',
            label: 'File',
            title: 'File',
            icon: 'fa-file',
            model: this.splitButtonItems,
            onClick: event => this.onSplitButtonClick(event)
        }),
        new ToolbarButton({
            id: 'idToolbarButton4',
            type: 'button',
            icon: 'fa-plus',
            visible: false,
            onClick: event => this.onButtonClick(event)
        })
    ];

    constructor() {}

    onButtonClick(event): void {
        console.debug('onButtonClick:', event);
    }

    onSplitButtonClick(event): void {
        //console.debug("onSplitButtonClick:", event, event.item.id, event.id);
        console.debug('onSplitButtonClick:', event);
    }

    onSplitButtonMenuClick(event): void {
        console.debug('onSplitButtonMenuClick:', event, event.item.id, event.id);
    }
}
