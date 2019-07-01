import { Component } from '@angular/core';

import { ListItem } from 'life-core/model';
import { MenuItem } from 'life-core/component/menu';

@Component({
    selector: 'test-button',
    templateUrl: './test-button.html'
})
export class TestButton {
    public disabled: boolean = false;

    public hidden: boolean = false;

    public trueFalseList: Array<ListItem> = [new ListItem('True', 'true'), new ListItem('False', 'false')];

    splitButtonItems: MenuItem[] = [
        { id: 'idNew', label: 'New', command: event => this.onSplitButtonMenuClick(event) },
        { id: 'idOpen', label: 'Open', command: event => this.onSplitButtonMenuClick(event) }
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
