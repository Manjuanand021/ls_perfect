import { DBDate } from './dbdate';

export class DBDateCrypted extends DBDate {
    public readonly $type: string = 'vpi.util.DBDateCrypted, LifeSuite';

    public static getNullDate(): DBDateCrypted {
        const date = new DBDateCrypted();
        date.datetime = null;
        return date;
    }
}
