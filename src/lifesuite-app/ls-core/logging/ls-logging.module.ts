import { NgModule } from '@angular/core';
import { LSLoggerProvider } from './ls-logger-provider';
import { LoggerProvider } from 'life-core/logging/logger-provider';
import { LoggingModule } from 'life-core/logging/logging.module';

@NgModule({
    imports: [LoggingModule],
    providers: [
        {
            provide: LoggerProvider,
            useClass: LSLoggerProvider
        }
    ]
})
export class LSLoggingModule {}
