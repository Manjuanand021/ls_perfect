import { NgModule } from '@angular/core';

import { ErrorHandler } from '@angular/core';

import { GlobalErrorHandler, ClientErrorLogger } from 'life-core/error-handler';

import { LsClientErrorLogger } from './ls-client-error-logger';
import { ClientErrorLoggerService } from './client-error-logger.service';
import { DisplayUIErrorDialogDelegate } from './display-ui-error-dialog.delegate';

@NgModule({
    providers: [
        DisplayUIErrorDialogDelegate,
        ClientErrorLoggerService,
        {
            provide: ClientErrorLogger,
            useClass: LsClientErrorLogger
        },
        {
            provide: ErrorHandler,
            useClass: GlobalErrorHandler
        }
    ]
})
export class LsErrorHandlerModule {}
