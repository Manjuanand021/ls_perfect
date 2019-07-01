import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LOGGERS } from 'life-core/logging';
import { ConsoleLogger, NullLogger } from './type';

@NgModule({
    imports: [CommonModule],
    providers: [
        { provide: LOGGERS, useClass: ConsoleLogger, multi: true },
        { provide: LOGGERS, useClass: NullLogger, multi: true }
    ]
})
export class LoggingModule {}
