import { Component, EventEmitter, Output } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { PanelMenu as PrimeNgPanelMenu } from 'primeng/panelmenu';

import { MenuItem } from '../model/menu-item.model';
import { MenuItemClickEvent } from '../event/menu.event';

@Component({
    selector: 'panel-menu',
    templateUrl: './panel-menu.html',
    animations: [
        trigger('rootItem', [
            state(
                'hidden',
                style({
                    height: '0px'
                })
            ),
            state(
                'visible',
                style({
                    height: '*'
                })
            ),
            transition('visible => hidden', animate('{{transitionParams}}')),
            transition('hidden => visible', animate('{{transitionParams}}'))
        ])
    ]
})
export class PanelMenu extends PrimeNgPanelMenu {
    @Output()
    public menuItemClick: EventEmitter<MenuItemClickEvent> = new EventEmitter();

    public handleClick(event: Event, item: MenuItem): void {
        super.handleClick(event, item);
        this.menuItemClick.emit(new MenuItemClickEvent(event, item));
    }

    public handleSubMenuClick(event: MenuItemClickEvent): void {
        this.menuItemClick.emit(event);
    }
}
