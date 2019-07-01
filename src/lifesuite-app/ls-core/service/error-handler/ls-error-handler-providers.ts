import { Provider } from '@angular/core';

import { ApplicationErrorFilter } from './application-error-filter';
import { HttpErrorFilter } from './http-error-filter';
import { AuthorizationFailureErrorHandler } from './authorization-failure-error-handler';
import { SystemErrorHandler } from './systerm-error-handler';

export const LS_ERROR_HANDLER_PROVIDERS: Provider[] = [
    ApplicationErrorFilter,
    HttpErrorFilter,
    AuthorizationFailureErrorHandler,
    SystemErrorHandler
];
