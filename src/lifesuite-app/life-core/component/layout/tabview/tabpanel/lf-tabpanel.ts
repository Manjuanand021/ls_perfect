import { Component, ViewEncapsulation, ViewContainerRef } from '@angular/core';
import { TabPanel } from 'primeng/primeng';

@Component({
    selector: 'lf-tabPanel',
    templateUrl: './lf-tabpanel.html',
    encapsulation: ViewEncapsulation.None
})
export class LfTabPanel extends TabPanel {
    constructor(viewContainer: ViewContainerRef) {
        super(viewContainer);
    }
}
