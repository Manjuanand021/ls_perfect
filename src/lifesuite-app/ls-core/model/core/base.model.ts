import { SessionModel } from './session.model';

export class BaseModel extends SessionModel {
    public readonly $type: string = 'vpi.aus.core.BaseModel, LifeSuite';
}
