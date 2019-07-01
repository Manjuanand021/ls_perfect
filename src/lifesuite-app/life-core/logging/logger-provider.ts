import { Injector, Injectable } from '@angular/core';

import { LOGGERS } from './logger.interface';
import { ILoggerImpl } from './logger-impl.interface';
import { ILoggerProvider } from './logger-provider.interface';
import { LogLevel } from './log-level';

@Injectable({
    providedIn: 'root'
})
export class LoggerProvider implements ILoggerProvider {
    private _injector: Injector;

    constructor(injector: Injector) {
        this._injector = injector;
    }

    public get loggers(): ILoggerImpl[] {
        return this._injector.get(LOGGERS);
    }
    public get logLevel(): LogLevel {
        return LogLevel.Log;
    }
}
