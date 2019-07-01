import { Injectable } from '@angular/core';
import { I18n } from 'life-core/i18n';
import { LocalSettings } from './local-settings';

@Injectable()
export class LocalSettingPromptComponentResources {
    protected i18n: I18n;
    public promptMessages: Map<string, string>;

    constructor(i18n: I18n) {
        this.i18n = i18n;
        this.setupMessages();
    }

    protected setupMessages(): void {
        this.promptMessages = new Map([
            [
                LocalSettings.AutoCollapseLeftNav,
                this.i18n({
                    value: 'Do you want to keep the left menu expanded when opening side dialog?',
                    id: 'localsettings.prompt.message'
                })
            ]
        ]);
    }
}
