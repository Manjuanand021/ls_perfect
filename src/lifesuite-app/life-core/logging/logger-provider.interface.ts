import { ILoggerImpl, LogLevel } from 'life-core/logging';

export interface ILoggerProvider {
    loggers: ILoggerImpl[];
    logLevel: LogLevel;
}
