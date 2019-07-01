import { Injector, Injectable, Type } from '@angular/core';

import { MenuActionHandler } from './menu-action.handler';
import { MenuUrlHandler } from './menu-url.handler';
import { SearchCaseHandler } from './search-case.handler';
import { ReassignCaseHandler } from './reassign-case.handler';

@Injectable()
export class MenuHandlerFactory {
    private _injector: Injector;

    constructor(injector: Injector) {
        this._injector = injector;
    }

    public createMenuHandler(handlerId: string): MenuActionHandler {
        const handlerClass = MenuHandlerMap[handlerId];
        if (!handlerClass) {
            throw new Error(`No Menu handler defined for menu '${handlerId}'.`);
        }
        return this._injector.get(handlerClass);
    }
}

export const MenuUrlHandlerId = 'menuUrlHandler';

const MenuHandlerMap: { readonly [handlerId: string]: Type<MenuActionHandler> } = {
    searchCase: SearchCaseHandler,
    reassignCase: ReassignCaseHandler,
    [MenuUrlHandlerId]: MenuUrlHandler
};
