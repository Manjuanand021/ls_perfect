import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs';

import { MockBackendService } from './mock-backend.service';

export abstract class MockBackendServiceInterceptor<TRequest, TResponse, TServiceParams> implements HttpInterceptor {
    private _mockBackendService: MockBackendService<TRequest, TResponse, TServiceParams>;

    constructor(mockBackendService: MockBackendService<TRequest, TResponse, TServiceParams>) {
        this._mockBackendService = mockBackendService;
    }

    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.needToProcess(request)) {
            return new Observable<HttpEvent<any>>(observer => {
                const mockResult = this._mockBackendService.execute(request) as TResponse;
                observer.next(this.createHttpResponse(mockResult));
                observer.complete();
            });
        } else {
            return next.handle(request);
        }
    }

    protected abstract needToProcess(request: HttpRequest<any>): boolean;

    private createHttpResponse(mockResult: TResponse): HttpResponse<any> {
        return new HttpResponse({ status: 200, body: mockResult });
    }
}
