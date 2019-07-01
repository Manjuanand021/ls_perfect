import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalSettingsService } from './local-settings.service';
import { LfDialogModule } from 'life-core/component/dialog/dialog.module';
import { LocalSettingPromptComponent } from './local-setting-prompt.component';
import { LocalSettingPromptComponentResources } from './local-setting-prompt.component.rc';

@NgModule({
    imports: [CommonModule, LfDialogModule],
    declarations: [LocalSettingPromptComponent],
    entryComponents: [LocalSettingPromptComponent],
    providers: [LocalSettingsService, LocalSettingPromptComponentResources]
})
export class LocalSettingsModule {}
