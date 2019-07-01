import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

// Modules
import { AuthModule } from 'life-core/authentication/auth.module';
import { AppI18nModule } from 'business/shared/i18n/app-i18n.module';
import { AppInitializeModule } from 'business/app/app-initialize.module';
import { AppMasterDetailModule } from 'business/shared/master-detail/app-master-detail.module';
import { LsStartupModule } from 'ls-core/startup/ls-startup.module';
import { LsViewModelModule } from 'ls-core/view-model/ls-view-model.module';
import { LogoutHandlerModule } from 'ls-core/handler/logout/logout-handler.module';
import { LandingModule } from 'business/landing/landing.module';
import { SessionModule } from 'business/shared/session/session.module';
import { BaseSharedModule } from 'shared/base.shared.module';
import { AppRoutingModule } from './app-routing.module';
import { LSLoggingModule } from 'ls-core/logging/ls-logging.module';
import { SignalRModule } from 'life-core/signalr/signalr.module';

// Components
import { AppComponent } from 'business/app';

// Providers
import { Session } from 'life-core/session';
import { AppSession } from 'ls-core/session';
import { LS_DATA_SERVICE_PROVIDERS, LS_ERROR_HANDLER_PROVIDERS } from 'ls-core/service';
import { LS_AUTHENTICATION_SERVICE_PROVIDERS } from 'ls-core/authentication';
import { SAVE_DATA_PROVIDERS } from 'life-core/handler';
import { MessagingService } from 'life-core/messaging';
import { ResourceManager } from 'ls-core/resource/resource-manager';
import { LsAppConfigModule } from 'ls-core/config/ls-app-config.module';
import { rootReducer } from 'ls-core/reducer/policy';
import { AuthorizationService } from 'life-core/authorization';
import { LsAuthorizationService } from 'ls-core/authorization';
import { LoginUserResolver } from 'business/login';
import { UserDataDelegate } from 'business/user/user-data.delegate';
import { CaseGroupHubService } from 'business/shared/signalr';
import { WINDOW_PROVIDERS } from 'life-core/util/window';

// Other
import { loadCldrData } from './shared/i18n/cldr-data-loader';
import { LocalSettingsModule } from 'life-core/local-settings/local-settings.module';

@NgModule({
    imports: [
        // INFRASTRUCTURE modules
        BaseSharedModule,
        AppI18nModule,
        AppInitializeModule,
        AppMasterDetailModule,
        AppRoutingModule,
        AuthModule,
        LSLoggingModule,
        LsAppConfigModule,
        LsViewModelModule,
        SessionModule,
        SignalRModule,
        StoreModule.forRoot(rootReducer),
        // FLOW modules
        LandingModule,
        LogoutHandlerModule,
        LsStartupModule,
        LocalSettingsModule
    ],
    providers: [
        // Make sure to list any application-wide providers
        // in this main module only, not including them second time
        // in any lazy-loaded modules. This will avoid possible side effects.
        AppSession,
        { provide: Session, useExisting: AppSession },
        { provide: AuthorizationService, useClass: LsAuthorizationService },
        LoginUserResolver,
        UserDataDelegate,
        ...LS_AUTHENTICATION_SERVICE_PROVIDERS,
        ...LS_DATA_SERVICE_PROVIDERS,
        ...LS_ERROR_HANDLER_PROVIDERS,
        ...SAVE_DATA_PROVIDERS,
        MessagingService,
        CaseGroupHubService,
        ResourceManager,
        ...WINDOW_PROVIDERS
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule {}

loadCldrData();
