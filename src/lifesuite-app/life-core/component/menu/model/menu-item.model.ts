import { EventEmitter } from '@angular/core';

import { MenuItem as PrimeNgMenuItem } from 'primeng/primeng';

export interface IMenuItem extends PrimeNgMenuItem {
    items?: IMenuItem[];
    route?: any;
}

export class MenuItem implements IMenuItem {
    public id?: string;
    public label?: string;
    public icon?: string;
    public url?: string;
    public routerLink?: any;
    public route?: any;
    public eventEmitter?: EventEmitter<any>;
    public items?: IMenuItem[];
    public expanded?: boolean;
    public disabled?: boolean;
    public visible?: boolean;
    public target?: string;
    public command?: (event?: any) => void;

    constructor(params: IMenuItem) {
        this.id = params.id;
        this.label = params.label;
        this.icon = params.icon;
        this.url = params.url;
        this.routerLink = params.routerLink;
        this.route = params.route;
        this.items = params.items
            ? params.items.map(item => {
                  return new MenuItem(item);
              })
            : null;
        this.expanded = params.expanded;
        this.disabled = params.disabled;
        this.visible = params.visible;
        this.target = params.target;
        this.command = params.command;
    }
}
