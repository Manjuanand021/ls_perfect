import { Injector } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';
import { IAuthenticationService } from './base-auth.service';

export abstract class BaseAuthGuard implements CanActivate {
    protected authService: IAuthenticationService;
    protected injector: Injector;

    constructor(injector: Injector) {
        this.injector = injector;
        this.authService = this.getAuthService();
    }

    protected abstract getAuthService(): IAuthenticationService;

    public canActivate(): boolean {
        if (this.isAuthenticated()) {
            return true;
        } else {
            this.handleUnauthenticated();
            return false;
        }
    }

    protected isAuthenticated(): boolean {
        return this.authService.loggedIn();
    }

    protected abstract handleUnauthenticated(): void;
}
