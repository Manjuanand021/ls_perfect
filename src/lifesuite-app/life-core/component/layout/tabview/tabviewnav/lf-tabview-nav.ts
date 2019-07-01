import { Component, ViewEncapsulation } from '@angular/core';
import { TabViewNav } from 'primeng/primeng';

export const INPUT_HOST = {
    '[class.ui-tabview-nav]': 'true',
    '[class.ui-helper-reset]': 'true',
    '[class.ui-helper-clearfix]': 'true',
    '[class.ui-widget-header]': 'true',
    '[class.ui-corner-all]': 'true'
};

@Component({
    selector: '[lf-tabViewNav]',
    templateUrl: './lf-tabview-nav.html',
    host: INPUT_HOST,
    encapsulation: ViewEncapsulation.None
})
export class LfTabViewNav extends TabViewNav {
    constructor() {
        super();
    }
}
