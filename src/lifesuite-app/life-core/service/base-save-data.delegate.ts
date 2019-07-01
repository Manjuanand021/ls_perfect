import { SaveDataContext } from './save-data-context';
import { LifeError } from 'life-core/service';

export abstract class BaseSaveDataDelegate<TData, TResult> {
    public abstract updateData(data: TData, context?: SaveDataContext): Promise<TResult>;
    public abstract getSaveDataResult(updateDataResult: TResult): SaveDataResult;
    public abstract getErrorsFromUpdateDataResult(updateDataResult: TResult): LifeError[];
}

export enum SaveDataResult {
    fail = 0,
    success = 1,
    noNeedToSave = 2
}
