import { DataSaveCallback } from '../data-save-callback';
import { SaveTabDataContext } from 'life-core/component/layout/tabview/messaging/save-tab-channel-data';

export const AppCloseChannel = {
    CloseApplication: 'CloseApplication',
    CancelClosingApplication: 'CancelClosingApplication',
    SaveApplication: 'SaveApplication',
    ByPassCloseGuard: 'ByPassCloseGuard'
};

export class AppCloseChannelDataContext {
    public saveTabDataContext: SaveTabDataContext;
    public callback: DataSaveCallback;

    public constructor(saveTabDataContext: SaveTabDataContext, callback: DataSaveCallback) {
        this.saveTabDataContext = saveTabDataContext;
        this.callback = callback;
    }
}
