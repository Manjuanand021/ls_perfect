import { Injector } from '@angular/core';

import { IActionHandler } from 'life-core/handler';
import { LinkMenuData } from 'ui/left-nav';

export abstract class MenuActionHandler implements IActionHandler {
    protected injector: Injector;

    constructor(injector: Injector) {
        this.injector = injector;
    }

    public abstract execute(actionParams?: LinkMenuData): void;
}

export interface MenuActionHandlerParams {
    linkUrl?: string;
}
