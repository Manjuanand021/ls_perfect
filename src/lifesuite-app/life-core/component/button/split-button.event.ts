import { MenuItem } from 'life-core/component/menu';

/**
 * SplitButtonClickEvent emitted on SplitButton click.
 */
export class SplitButtonClickEvent {
    public event: Event;
    public id: string;
    public item: MenuItem;

    constructor(event: Event, id: string, item: MenuItem) {
        this.event = event;
        this.id = id;
        this.item = item;
    }
}

/**
 * SplitButtonMenuClickEvent emitted on SplitButton menu item click.
 */
export class SplitButtonMenuClickEvent {
    public originalEvent: Event;
    public id: string;
    public item: MenuItem;

    constructor(originalEvent: Event, id: string, item: MenuItem) {
        this.originalEvent = originalEvent;
        this.id = id;
        this.item = item;
    }
}
