import { Component } from '@angular/core';
import { BrowserRefreshHandler } from 'life-core/routing/browser-refresh-handler';

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    constructor(browserRefreshHandler: BrowserRefreshHandler) {
        browserRefreshHandler.handlerRefresh();
    }
}
