import { NgModule } from '@angular/core';
import { RouterModule, Routes, Route } from '@angular/router';

import { RoutePath } from 'life-core/routing';
import { LoginComponent } from 'business/login/login.component';
import { SSOLogoutComponent } from 'business/login/sso-logout.component';
import { CarouselItemResources } from 'business/login/carousel-item.rc';

const AppLogoutRoute: Route = {
    path: RoutePath.Logout,
    component: LoginComponent
};

const AppLogoutOnSessionTimeoutRoute: Route = {
    path: RoutePath.LogoutOnSessionTimeout,
    component: LoginComponent
};

const AppLogoutOnUnauthorizedRoute: Route = {
    path: RoutePath.LogoutOnUnauthorized,
    component: LoginComponent
};

const AppSSOLogoutDefaultRoute: Route = {
    path: RoutePath.SSOLogoutDefault,
    component: SSOLogoutComponent
};

const AppSSOLogoutOnUnauthorizedRoute: Route = {
    path: RoutePath.SSOLogoutOnUnauthorized,
    component: SSOLogoutComponent
};

const LoginRoutes: Routes = [
    {
        path: '',
        component: LoginComponent
    },
    AppLogoutRoute,
    AppLogoutOnSessionTimeoutRoute,
    AppLogoutOnUnauthorizedRoute,
    AppSSOLogoutDefaultRoute,
    AppSSOLogoutOnUnauthorizedRoute
];

@NgModule({
    imports: [RouterModule.forChild(LoginRoutes)],
    exports: [RouterModule],
    providers: [CarouselItemResources]
})
export class LoginRoutingModule {}
