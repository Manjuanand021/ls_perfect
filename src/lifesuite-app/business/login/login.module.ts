import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';
import { LoginComponent } from './login.component';
import { SSOLogoutComponent } from './sso-logout.component';
import { PasswordChangeModule } from './password-change/password-change.module';
import { LoginImagesCarouselComponent } from './login-images-carousel.component';
import { LoginRoutingModule } from './login-routing.module';
import { OpenAppLandingHandler } from './open-app-landing.handler';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbModule.forRoot(),
        LsComponentsModule,
        PasswordChangeModule,
        LoginRoutingModule
    ],
    declarations: [LoginComponent, SSOLogoutComponent, LoginImagesCarouselComponent],
    exports: [LoginComponent],
    providers: [OpenAppLandingHandler]
})
export class LoginModule {}
