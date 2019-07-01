export class ClickEventResolver {
    // TODO: see if this class could be converted to a directive
    // subscribing to Observable.fromEvent<Event>(host, 'click');
    // See link below on how to create event observer:
    // https://stackoverflow.com/questions/38640473/how-to-trottle-a-mousemove-event-in-rxjs-when-using-angular-2-typescript

    private _clickHandler: Function;
    private _doubleClickHandler: Function;

    private _clickCount: number = 0;
    private _singleClickTimer: any;

    constructor(clickHandler: Function, doubleClickHandler: Function) {
        this._clickHandler = clickHandler;
        this._doubleClickHandler = doubleClickHandler;
    }

    public onClick(event: any): void {
        this._clickCount++;
        if (this._clickCount === SingleClickCount) {
            this._singleClickTimer = setTimeout(() => {
                this.resetClickCount();
                this._clickHandler(event);
            }, DoubleClickTimeout);
        } else if (this._clickCount === DoubleClickCount) {
            clearTimeout(this._singleClickTimer);
            this.resetClickCount();
            this._doubleClickHandler(event);
        }
    }

    private resetClickCount(): void {
        this._clickCount = 0;
    }
}

const SingleClickCount = 1;
const DoubleClickCount = 2;
const DoubleClickTimeout = 300;
