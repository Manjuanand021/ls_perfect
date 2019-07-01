import { Injector } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';

import { map, catchError } from 'rxjs/operators';

import { LoginRequest, LogoutRequest } from './auth-request.model';
import { Session } from 'life-core/session/session';
import { Logger, ILogger } from 'life-core/logging';

/**
 * User authentication service interface.
 */
export interface IAuthenticationService {
    login(loginRequest: LoginRequest): Promise<any>;
    loggedIn(): boolean;
    logout(logoutRequest: LogoutRequest): Promise<void>;
}

/**
 * Default user authentication service.
 */
export abstract class BaseAuthenticationService implements IAuthenticationService {
    // user session tracking
    protected session: Session;

    // http client for XHR calls
    protected http: HttpClient;

    private _logger: ILogger;

    constructor(protected injector: Injector) {
        this.http = injector.get(HttpClient);
        this._logger = injector.get(Logger);
    }

    /**
     * Processes user login request.
     * For LS this method returns IUIResponse which is currently defined in ls-core;
     * TODO: Move IUIResponse to life-core?
     */

    public login(loginRequest: LoginRequest): Promise<any> {
        const request: string = this.createRequestBody(loginRequest);
        this.logRequest(AuthMethodID.Login, request);
        const headers = this.createHeaders();
        return this.http
            .post(this.getLoginServiceUrl(), request, { headers: headers })
            .pipe(
                map((response: HttpResponse<any>) => {
                    this.logResponse(AuthMethodID.Login, response);
                    return response;
                }),
                catchError(error => {
                    this._logger.error(`AuthenticationService -> login() error: ${error}`);
                    throw error;
                })
            )
            .toPromise();
    }

    /**
     * Processes user logout request.
     */
    public logout(logoutRequest: LogoutRequest): Promise<any> {
        const request: string = this.createRequestBody(logoutRequest);
        this.logRequest(AuthMethodID.Logout, request);
        const headers = this.createHeaders();
        return this.http
            .post(this.getLogoutServiceUrl(), request, { headers: headers })
            .pipe(
                map(response => {
                    this.logResponse(AuthMethodID.Logout, response);
                    return response;
                })
            )
            .toPromise();
    }

    private createRequestBody(request: Object): string {
        let params = new HttpParams();
        Object.keys(request).forEach(key => {
            params = params.append(key, request[key]);
        });
        return params.toString();
    }

    private createHeaders(): HttpHeaders {
        return new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    }

    protected abstract getLoginServiceUrl(): string;

    protected abstract getLogoutServiceUrl(): string;

    public abstract loggedIn(): boolean;

    private logRequest(type: string, request: any): void {
        // this._logger.debug(request);
        this._logger.log(`${type} REQUEST`, request);
    }

    private logResponse(type: string, response: any): void {
        // this._logger.debug(response);
        this._logger.log(`${type} RESPONSE`, response);
    }
}

const AuthMethodID = {
    Login: 'LOGIN',
    Logout: 'LOGOUT'
};
