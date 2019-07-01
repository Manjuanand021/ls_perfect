import { Component, EventEmitter } from '@angular/core';

import { ICompose } from 'life-core/component/compose';
import { IDialogViewModel, IDialogResultEventEmitter, DialogViewModelResult } from 'life-core/component/dialog';
import { I18n } from 'life-core/i18n';
import { LocalSettingPromptComponentResources } from './local-setting-prompt.component.rc';
import { LocalSettingPromptDialogResult } from 'life-core/local-settings/local-setting-prompt.service';

@Component({
    selector: 'local-setting-prompt',
    templateUrl: './local-setting-prompt.component.html'
})
export class LocalSettingPromptComponent implements ICompose, IDialogViewModel, IDialogResultEventEmitter {
    public message: string;
    public dialogResultEventEmitter: EventEmitter<any> = new EventEmitter<any>();

    private _settingName: string;
    private _localSettingPromptComponentResources: LocalSettingPromptComponentResources;
    protected i18n: I18n;

    constructor(i18n: I18n, localSettingPromptComponentResources: LocalSettingPromptComponentResources) {
        this.i18n = i18n;
        this._localSettingPromptComponentResources = localSettingPromptComponentResources;
    }

    public setModel(model: any): void {
        const localSettingPromptData = model.parameterData as LocalSettingPromptData;
        this._settingName = localSettingPromptData.settingName;
        this.message = this._localSettingPromptComponentResources.promptMessages.get(this._settingName);
    }

    public onDialogButtonClick(buttonId: string): Promise<DialogViewModelResult> {
        const returnValue = new LocalSettingPromptDialogResult();
        returnValue.buttonId = buttonId;
        this.dialogResultEventEmitter.emit(new DialogViewModelResult(returnValue, true));
        return Promise.resolve(new DialogViewModelResult(returnValue, true));
    }
}

export class LocalSettingPromptData {
    constructor(settingName: string) {
        this.settingName = settingName;
    }
    public settingName: string;
}
