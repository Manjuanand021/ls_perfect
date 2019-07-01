import { ILogger } from 'life-core/logging';

export interface ILoggerImpl extends ILogger {
    readonly name: string;
}
