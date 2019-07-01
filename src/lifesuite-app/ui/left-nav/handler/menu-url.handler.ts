import { Injectable, Injector } from '@angular/core';

import { MenuActionHandler } from './menu-action.handler';
import { LinkMenuData } from 'ui/left-nav';

@Injectable()
export class MenuUrlHandler extends MenuActionHandler {
    constructor(injector: Injector) {
        super(injector);
    }
    public execute(actionParams?: LinkMenuData): void {
        this.openWindowWithPostRequest(actionParams);
    }
    private openWindowWithPostRequest(actionParams?: LinkMenuData): void {
        const winName = 'LsLegacy';
        const winURL = `${actionParams.linkParam[0]}${actionParams.linkURL}`;
        const windowoption = 'location=no, menubar=no, status=no, toolbar=no, scrollbars=yes, resizable=yes';
        const form = document.createElement('form');
        form.setAttribute('method', 'post');
        form.setAttribute('action', winURL);
        form.setAttribute('target', winName);
        document.body.appendChild(form);

        let win = window.open('', winName, windowoption);
        win.focus();
        const html = '<br><b>Loading, please wait...  <b></br>';
        try {
            win.document.body.innerHTML = html;
        } catch (e) {
            // if AngularUI and Legacy configured on different domain and popup window is already open with same name
            // browser will throw 'accessing a cross-origin frame' exception and not allow to update window
            // in this case will close already open window and open new one to launch legacy.
            win.close();
            win = window.open('', winName, windowoption);
            win.focus();
            win.document.body.innerHTML = html;
        }
        form.target = winName;
        form.submit();
        document.body.removeChild(form);
    }
}
