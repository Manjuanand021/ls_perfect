export class LazyLoadEvent extends Event {
    public static LAZYLOAD_STARTED: string = 'lazyLoadStarted';
    public static LAZYLOAD_FINISHED: string = 'lazyLoadFinished';
    public propertyName: string;

    constructor(type: string, propertyName: string, bubbles: boolean = false, cancelable: boolean = false) {
        super(type, { bubbles: bubbles, cancelable: cancelable });
        this.propertyName = propertyName;
    }

    public static getNewLazyLoadStartEvent(propertyName: string): LazyLoadEvent {
        return new LazyLoadEvent(LazyLoadEvent.LAZYLOAD_STARTED, propertyName);
    }

    public static getNewLazyLoadFinishEvent(propertyName: string): LazyLoadEvent {
        return new LazyLoadEvent(LazyLoadEvent.LAZYLOAD_FINISHED, propertyName);
    }
}
