import { NgModule } from '@angular/core';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { XsrfInterceptor } from './xsrf.interceptor';

@NgModule({
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: XsrfInterceptor,
            multi: true
        }
    ]
})
export class AuthModule {}
