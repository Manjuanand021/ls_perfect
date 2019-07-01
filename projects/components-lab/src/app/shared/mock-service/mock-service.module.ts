import { NgModule } from '@angular/core';

import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { LsMockBackendServiceInterceptor, LplaMockBackendServiceInterceptor } from './mock-backend-service.interceptor';

@NgModule({
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: LplaMockBackendServiceInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: LsMockBackendServiceInterceptor,
            multi: true
        }
    ]
})
export class MockServiceModule {}
