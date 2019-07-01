import { Injectable } from '@angular/core';
import { ILoggerImpl } from './../logger-impl.interface';

@Injectable()
export class NullLogger implements ILoggerImpl {
    public readonly name: string = 'null';

    public log(message: string, ...optionalParams: any[]): void {}

    public warn(message: string, ...optionalParams: any[]): void {}

    public info(message: string, ...optionalParams: any[]): void {}

    public error(message: string, ...optionalParams: any[]): void {}
}
