import { NgModule, APP_INITIALIZER, TRANSLATIONS } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';

import { ComponentsModule } from 'life-core/component/components.module';

/* App Root */
import { TestComponent } from './test.component';

/* Routing Module */
import { TestRoutingModule } from './test-routing.module';
import { TestUIModule } from 'lab/shared/test-ui.module';

import { AppConfig } from 'life-core/config/app.config';
import { LsAppConfig } from 'ls-core/config';

import { I18nModule, IntlModule, IntlService, APP_LOCALES, LOCALE_ID, DEFAULT_LOCALE_ID, Locale } from 'life-core/i18n';
import { LsI18nModule } from 'ls-core/i18n';
import { loadCldrData } from 'lab/component/input/cldr-data-loader';
import { LsViewModelModule } from 'ls-core/view-model/ls-view-model.module';

import { DataService } from 'ls-core/service';
import { ViewDataService } from 'lpla-core/service';
import { SAVE_DATA_PROVIDERS } from 'life-core/handler';
import { AuthorizationService } from 'life-core/authorization';
import { Session } from 'life-core/session';
import { LoggingModule } from 'life-core/logging/logging.module';
import { ViewValidationStrategy } from 'life-core/view-model';
import { LsAuthorizationService } from 'ls-core/authorization';
import { AppSession } from 'ls-core/session/app-session';
import { rootReducer } from 'ls-core/reducer/policy';
import { LS_ERROR_HANDLER_PROVIDERS } from 'ls-core/service';

import { MockServiceModule } from 'lab/shared/mock-service/mock-service.module';
import { LplaMockBackendService, LsMockBackendService } from 'lab/shared/mock-service/mock-backend.service';

/* Tests Pages */
import { TestInputsModule } from 'lab/component/input/test-inputs.module';
import { TestMiscModule } from 'lab/component/misc/test-misc.module';
import { TestItemListModule } from 'lab/component/item-list/test-item-list.module';
import { TestMasterDetailModule } from 'lab/component/master-detail/test-master-detail.module';
import { TestMaterial2AppModule } from 'lab/material2/test-material.module';
import { TestDataGridModule } from 'lab/component/grid/test-data-grid.module';
import { TestDialogModule } from 'lab/component/dialog/test-dialog.module';
import { TestMessagingModule } from 'lab/messaging/test-messaging.module';
import { TestFormModule } from 'lab/component/form/test-form.module';
import { TestDynamicFormModule } from 'lab/component/dynamic-form/test-dynamic-form.module';
import { TestAuthorizationModule } from 'lab/authorization/test-authorization.module';
// import { LplaViewModelModule } from './lpla-core/view-model/lpla-view-model.module';
// import { TestFieldsViewModelModule } from './lpla/test-fields-vm.module';

export function appInitializeServiceFactory(intlService: IntlService): Function {
    return (): any => ({});
}

export const DEFINED_APP_LOCALES = [
    { provide: APP_LOCALES, multi: true, useValue: Locale.en_US },
    { provide: APP_LOCALES, multi: true, useValue: Locale.fr_CA }
];

@NgModule({
    imports: [
        // INFRASTRUCTURE modules
        BrowserModule,
        FormsModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule,
        LoggingModule,
        ComponentsModule,
        MockServiceModule,
        LsViewModelModule,
        // LplaViewModelModule,
        I18nModule,
        IntlModule,
        LsI18nModule,
        StoreModule.forRoot(rootReducer),
        // TEST modules
        TestRoutingModule,
        TestUIModule,
        TestInputsModule,
        TestMiscModule,
        TestItemListModule,
        TestMasterDetailModule,
        TestMaterial2AppModule,
        TestDataGridModule,
        TestDialogModule,
        TestMessagingModule,
        TestFormModule,
        TestDynamicFormModule,
        TestAuthorizationModule
        // TestFieldsViewModelModule
    ],
    providers: [
        HttpClient,
        LsMockBackendService,
        LplaMockBackendService,
        AppSession,
        { provide: Session, useClass: AppSession },
        LsAppConfig,
        { provide: AppConfig, useClass: LsAppConfig },
        { provide: AuthorizationService, useClass: LsAuthorizationService },
        DataService,
        ViewDataService,
        ViewValidationStrategy,
        ...SAVE_DATA_PROVIDERS,
        ...LS_ERROR_HANDLER_PROVIDERS,
        {
            provide: APP_INITIALIZER,
            useFactory: appInitializeServiceFactory,
            deps: [IntlService],
            multi: true
        },
        ...DEFINED_APP_LOCALES,
        { provide: DEFAULT_LOCALE_ID, useValue: Locale.en_US },
        {
            provide: TRANSLATIONS,
            useFactory: locale => {
                return require(`raw-loader!../../../../projects/components-lab/src/locale/messages.${locale}.xlf`);
            },
            deps: [LOCALE_ID]
        }
        // {
        //     provide: LOCALE_ID,
        //     useFactory: localeIdFactory, // returns locale string
        //     deps: [NG_LOCALE_ID]
        // }
    ],
    declarations: [TestComponent],
    bootstrap: [TestComponent]
})
export class TestModule {}

loadCldrData();
