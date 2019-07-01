import { Component, Input, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { PanelMenuSub as PrimeNgPanelMenuSub } from 'primeng/panelmenu';

import { MenuItem } from '../model/menu-item.model';
import { MenuItemClickEvent } from '../event/menu.event';

@Component({
    selector: 'panel-menu-sub',
    templateUrl: './panel-menu-sub.html',
    animations: [
        trigger('submenu', [
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
export class PanelMenuSub extends PrimeNgPanelMenuSub {
    @Input()
    public item: MenuItem;

    @Input()
    public expanded: boolean;

    @Output()
    public submenuClick: EventEmitter<MenuItemClickEvent> = new EventEmitter();

    public handleClick(event: Event, item: MenuItem): void {
        if (item.disabled) {
            event.preventDefault();
            return;
        }

        item.expanded = !item.expanded;

        // if (!item.url) {
        event.preventDefault();
        // }

        // if (item.command) {
        // 	if (!item.eventEmitter) {
        // 		item.eventEmitter = new EventEmitter();
        // 		item.eventEmitter.subscribe(item.command);
        // 	}

        // 	item.eventEmitter.emit({
        // 		originalEvent: event,
        // 		item: item
        // 	});
        // }

        this.submenuClick.emit(new MenuItemClickEvent(event, item));
    }
}
