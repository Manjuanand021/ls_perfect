import { TabDescriptor } from '../model/tab-descriptor.model';

/**
 * Model of tab Change event emitted by TabView
 */
export class TabChangeEvent {
    public originalEvent: Event;

    public fromIndex: number;

    public toIndex: number;

    public change: Function;

    public beforeChange: (from: TabDescriptor, to: TabDescriptor) => void;

    constructor({
        originalEvent,
        fromIndex,
        toIndex,
        fnChange,
        fnBeforeChange
    }: {
        originalEvent?: Event;
        fromIndex?: number;
        toIndex?: number;
        fnChange?: Function;
        fnBeforeChange?: (from: TabDescriptor, to: TabDescriptor) => void;
    }) {
        this.originalEvent = originalEvent;
        this.fromIndex = fromIndex;
        this.toIndex = toIndex;
        this.change = fnChange;
        this.beforeChange = fnBeforeChange;
    }
}

/**
 * Model of tab Close event emitted by TabView
 */
export class TabCloseEvent {
    public originalEvent: Event;

    public index: number;

    public close: Function;

    public afterClose: (tab: TabDescriptor) => void;

    constructor({ originalEvent, index, fnClose }: { originalEvent?: Event; index?: number; fnClose?: Function }) {
        this.originalEvent = originalEvent;
        this.index = index;
        this.close = fnClose;
    }
}
