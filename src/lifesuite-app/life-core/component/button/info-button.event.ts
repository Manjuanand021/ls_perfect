/**
 * InfoButtonClickEvent emitted on InfoButton click.
 */
export class InfoButtonClickEvent {
    public event: Event;
    public id: string;
    public label: string;

    constructor(event: Event, id: string, label: string) {
        this.event = event;
        this.id = id;
        this.label = label;
    }
}
