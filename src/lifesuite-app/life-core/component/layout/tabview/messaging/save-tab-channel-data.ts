import { SaveDataContext } from 'life-core/service';
import { SaveDataCallback, DataSaveStatus } from 'life-core/handler';

export class SaveTabDataContext extends SaveDataContext {
    public isTabNavigatingAway: boolean;

    constructor(isNavigatingAway: boolean = false, isTabNavigatingAway: boolean = false) {
        super(isNavigatingAway);
        this.isTabNavigatingAway = isTabNavigatingAway;
    }
}

export type SaveAndCloseCallback = (saveResult: DataSaveStatus) => void;

export class SaveTabChannelData {
    public callback: SaveDataCallback;

    public context: SaveTabDataContext;

    constructor(callback: SaveDataCallback, context: SaveTabDataContext) {
        this.callback = callback;
        this.context = context;
    }
}
