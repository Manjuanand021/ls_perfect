import { Injectable } from '@angular/core';
import { ILoggerImpl } from './../logger-impl.interface';

@Injectable()
export class ConsoleLogger implements ILoggerImpl {
    public readonly name: string = 'console';

    public log(message: string, ...optionalParams: any[]): void {
        console.log(message, ...optionalParams[0]);
    }

    public warn(message: string, ...optionalParams: any[]): void {
        console.warn(message, ...optionalParams[0]);
    }

    public info(message: string, ...optionalParams: any[]): void {
        console.info(message, ...optionalParams[0]);
    }

    public error(message: string, ...optionalParams: any[]): void {
        console.error(message, ...optionalParams[0]);
    }
}
