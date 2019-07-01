import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpXsrfTokenExtractor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * HTTP interceptor adds servier-side generated
 * antiforgery X-XSRF-TOKEN to all http requests.
 * Adding token manually became reqiured with @angular/common/http.
 */
@Injectable()
export class XsrfInterceptor implements HttpInterceptor {
    private _httpXsrfTokenExtractor: HttpXsrfTokenExtractor;

    constructor(httpXsrfTokenExtractor: HttpXsrfTokenExtractor) {
        this._httpXsrfTokenExtractor = httpXsrfTokenExtractor;
    }

    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let requestToForward = request;
        const token = this._httpXsrfTokenExtractor.getToken() as string;
        if (token !== null) {
            requestToForward = request.clone({ setHeaders: { 'X-XSRF-TOKEN': token } });
        }
        return next.handle(requestToForward);
    }
}
