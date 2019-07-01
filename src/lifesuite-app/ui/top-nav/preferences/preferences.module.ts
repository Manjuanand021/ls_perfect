import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';

import { MembershipGridComponent } from 'ui/top-nav/preferences/membership-list/membership.component';
import { PreferencesAuthorizationGridComponent } from 'ui/top-nav/preferences/authorization-list/preferences-authorization.component';
import { PreferencesDataResolver } from 'ui/top-nav/preferences/preferences-data.resolver';
import { PreferencesComponent } from 'ui/top-nav/preferences/preferences.component';
import { PreferenceLocalSettingsResolver } from './preference-local-settings.resolver';

@NgModule({
    imports: [CommonModule, FormsModule, LsComponentsModule],
    declarations: [PreferencesComponent, MembershipGridComponent, PreferencesAuthorizationGridComponent],
    providers: [PreferencesDataResolver, PreferenceLocalSettingsResolver],
    entryComponents: [PreferencesComponent]
})
export class PreferencesModule {}
