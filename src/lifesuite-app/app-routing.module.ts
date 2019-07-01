import { NgModule } from '@angular/core';
import { RouterModule, Routes, Route, RouteReuseStrategy } from '@angular/router';

import { CustomRouteReuseStrategy, RoutePath } from 'life-core/routing';
import { LsRoutePath } from 'ui/routing';
import { AppInitializeErrorComponent } from 'business/app';
import { AppAuthGuard } from 'business/shared/authentication';
import { CanDeactivateGuard, ResetFormDeactivateGuard } from 'life-core/view-model';
import { LandingComponent } from 'business/landing/landing.component';
import { LoginUserResolver } from 'business/login';

const DefaultAppRoute: Route = {
    path: '',
    redirectTo: RoutePath.App,
    pathMatch: 'full'
};

const RedirectToAppRoute: Route = {
    path: `${RoutePath.Index}/${RoutePath.App}`,
    redirectTo: RoutePath.App,
    pathMatch: 'full'
};

const AppLoginRoute: Route = {
    path: RoutePath.Login,
    loadChildren: './business/login/login.module#LoginModule'
};

const AppHomeRoute: Route = {
    path: LsRoutePath.Home,
    loadChildren: './business/home/home.module#HomeModule'
};

const AppPolicyRoute: Route = {
    path: `${LsRoutePath.Policy}/:id`,
    loadChildren: './business/policy/policy.module#PolicyModule',
    canActivate: [AppAuthGuard]
};

const AppStandaloneViewNotesRoute: Route = {
    path: `${RoutePath.Index}/${RoutePath.App}/${LsRoutePath.Policy}/:id/${LsRoutePath.ViewNotes}`,
    loadChildren: './business/policy/note/view-notes/view-notes.module#ViewNotesModule',
    resolve: { loginUserResolver: LoginUserResolver }
};

const AppSearchRoute: Route = {
    path: LsRoutePath.Search,
    loadChildren: './business/search-case/search.module#SearchModule'
};

const AppReassignCaseRoute: Route = {
    path: LsRoutePath.ReassignCase,
    loadChildren: './business/reassign-case/reassign-case.module#ReassignCaseModule'
};

const AppReloadRoute: Route = {
    path: `${RoutePath.Index}/${RoutePath.App}/${RoutePath.Reload}`,
    redirectTo: RoutePath.App,
    pathMatch: 'full'
};

const AppInitializeErrorRoute: Route = {
    path: RoutePath.AppInitializeError,
    component: AppInitializeErrorComponent
};

const WildcardAppRoute: Route = {
    path: RoutePath.Wildcard,
    redirectTo: RoutePath.Login
};

const AppRoute: Route = {
    path: RoutePath.App,
    component: LandingComponent,
    canActivate: [AppAuthGuard],
    resolve: { loginUserResolver: LoginUserResolver },
    children: [AppHomeRoute, AppPolicyRoute, AppSearchRoute, AppReassignCaseRoute]
};

export const LifeSuiteAppRoutes: Routes = [
    DefaultAppRoute,
    AppLoginRoute,
    RedirectToAppRoute,
    AppRoute,
    AppReloadRoute,
    AppInitializeErrorRoute,
    AppStandaloneViewNotesRoute,
    WildcardAppRoute
];

@NgModule({
    imports: [RouterModule.forRoot(LifeSuiteAppRoutes)],
    exports: [RouterModule],
    providers: [
        AppAuthGuard,
        CanDeactivateGuard,
        ResetFormDeactivateGuard,
        { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy }
    ]
})
export class AppRoutingModule {}
