import { Injector, Injectable } from '@angular/core';

import { LogLevel, LOGGERS, ILoggerImpl } from 'life-core/logging';
import { StartupSetting, LsAppConfig } from 'ls-core/config';
import { ConsoleLogger } from 'life-core/logging/type/console-logger';
import { ILoggerProvider } from 'life-core/logging/logger-provider.interface';

@Injectable()
export class LSLoggerProvider implements ILoggerProvider {
    private _loggers: ILoggerImpl[];
    private _logLevel: LogLevel;
    private _logOutputLocations: string[];
    private _initialized: boolean;
    private _injector: Injector;

    constructor(injector: Injector) {
        this._injector = injector;
    }

    public get loggers(): ILoggerImpl[] {
        this.initialize();
        return this._initialized ? this._loggers : [new ConsoleLogger()];
    }
    public get logLevel(): LogLevel {
        this.initialize();
        return this._initialized ? this._logLevel : LogLevel.Log;
    }

    private initialize(): void {
        const appConfig = this._injector.get(LsAppConfig);
        if (!this._initialized && appConfig.startupSettings.length > 0) {
            this._logLevel = appConfig.getStartupSetting(StartupSetting.ClientLogLevel) as LogLevel;
            if (!this._logLevel) {
                throw new Error('StartupSetting.LogLevel is not defined.');
            }
            // Temporarily override logLevel from database for memory profiling
            this._logLevel = LogLevel.Error;

            const logOutputLocationsString = appConfig.getStartupSetting(StartupSetting.ClientLogDestinations);
            if (!logOutputLocationsString) {
                throw new Error('StartupSetting.LogOutputLocations is not defined.');
            }
            this._logOutputLocations = logOutputLocationsString
                ? appConfig.getStartupSetting(StartupSetting.ClientLogDestinations).split(',')
                : [];
            this._loggers = this.setupLoggers();
            this._initialized = true;
        }
    }

    private setupLoggers(): ILoggerImpl[] {
        const loggers: ILoggerImpl[] = [];
        const availableLoggers = this._injector.get(LOGGERS);
        availableLoggers.forEach(logger => {
            if (this.isLoggerRegistered(logger)) {
                loggers.push(logger);
            }
        });
        return loggers;
    }

    private isLoggerRegistered(logger: ILoggerImpl): boolean {
        return this._logOutputLocations.find(logLocation => logLocation == logger.name) !== undefined;
    }
}
