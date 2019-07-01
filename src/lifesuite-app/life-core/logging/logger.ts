import { Injectable } from '@angular/core';

import { ILoggerProvider } from './logger-provider.interface';
import { LoggerProvider } from './logger-provider';
import { ILogger } from './logger.interface';
import { LogLevel } from './log-level';

@Injectable({
    providedIn: 'root'
})
export class Logger implements ILogger {
    private _loggerProvider: ILoggerProvider;

    constructor(loggerProvider: LoggerProvider) {
        this._loggerProvider = loggerProvider;
    }

    public log(message: string, ...optionalParams: any[]): void {
        if (this._loggerProvider.logLevel === LogLevel.Log) {
            this._loggerProvider.loggers.forEach(logger => {
                logger.log(message, optionalParams);
            });
        }
    }

    public warn(message: string, ...optionalParams: any[]): void {
        if (this._loggerProvider.logLevel === LogLevel.Warn || this._loggerProvider.logLevel == LogLevel.Log) {
            this._loggerProvider.loggers.forEach(logger => {
                logger.warn(message, optionalParams);
            });
        }
    }

    public info(message: string, ...optionalParams: any[]): void {
        if (this._loggerProvider.logLevel === LogLevel.Info || this._loggerProvider.logLevel == LogLevel.Log) {
            this._loggerProvider.loggers.forEach(logger => {
                logger.log(message, optionalParams);
            });
        }
    }

    public error(message: string, ...optionalParams: any[]): void {
        if (this._loggerProvider.logLevel === LogLevel.Error || this._loggerProvider.logLevel == LogLevel.Log) {
            this._loggerProvider.loggers.forEach(logger => {
                logger.error(message, optionalParams);
            });
        }
    }
}
