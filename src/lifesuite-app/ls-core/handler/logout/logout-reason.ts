import { RoutePath, ModulePath } from 'life-core/routing';

export enum LogoutReason {
    UserLogout = 1,
    SessionTimeout = 2,
    HttpAuthorizationError = 3
}

export const NonSSOLogoutRouteByReason = {
    [LogoutReason.UserLogout]: `/${ModulePath.Login}/${RoutePath.Logout}`,
    [LogoutReason.SessionTimeout]: `/${ModulePath.Login}/${RoutePath.LogoutOnSessionTimeout}`,
    [LogoutReason.HttpAuthorizationError]: `/${ModulePath.Login}/${RoutePath.LogoutOnUnauthorized}`
};

export const SSOLogoutRouteByReason = {
    [LogoutReason.UserLogout]: `/${ModulePath.Login}/${RoutePath.SSOLogoutDefault}`,
    [LogoutReason.SessionTimeout]: `/${ModulePath.Login}/${RoutePath.SSOLogoutOnSessionTimeout}`,
    [LogoutReason.HttpAuthorizationError]: `/${ModulePath.Login}/${RoutePath.SSOLogoutOnUnauthorized}`
};
