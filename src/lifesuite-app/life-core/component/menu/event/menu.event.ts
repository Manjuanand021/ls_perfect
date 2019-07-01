import { MenuItem } from '../model/menu-item.model';

/**
 * Menu Click event event emitted by PanelMenu
 */
export class MenuItemClickEvent {
    public originalEvent: Event;

    public data: MenuItem;

    constructor(originalEvent: Event, data: MenuItem) {
        this.originalEvent = originalEvent;
        this.data = data;
    }
}
