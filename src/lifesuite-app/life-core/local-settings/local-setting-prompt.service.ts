import { Injectable } from '@angular/core';
import {
    PopoverDialog,
    PopoverDialogParams,
    DialogButtonType,
    DialogButton,
    DialogResult
} from 'life-core/component/dialog';

import { QueryLocalSetting } from './user-local-settings';
import { ILocalSettingsService, LocalSettingsService } from './local-settings.service';

@Injectable()
export class LocalSettingPromptService {
    private _localSettingsService: ILocalSettingsService;
    private _settingName: string;
    private _popoverDialog: PopoverDialog;

    constructor(localSettingsService: LocalSettingsService) {
        this._localSettingsService = localSettingsService;
    }

    public showLocalSettingPrompt<T>(params: LocalSettingPromptServiceParams<T>): void {
        this.initData<T>(params);

        const localSetting = this.getLocalSettingFromStorage<T>();
        if (!localSetting || !localSetting.isQueried) {
            this.openPromptDialog();
        }
    }

    protected initData<T>(params: LocalSettingPromptServiceParams<T>): void {
        this._settingName = params.settingName;
        this._popoverDialog = params.popoverDialog;
        const customPopoverParams = params.popoverParams;

        const localSettingPopoverParams: PopoverDialogParams = {
            content: customPopoverParams.content,
            title: customPopoverParams.title,
            buttons: [
                new DialogButton({ type: DialogButtonType.YES }),
                new DialogButton({ type: DialogButtonType.NO })
            ],
            triggers: 'manual',
            data: customPopoverParams.data,
            placement: customPopoverParams.placement,
            handler: (result: DialogResult) => {
                this.onPopoverButtonClick<T>(result, params.settingValueResolver);
            }
        };
        this._popoverDialog.popoverParams = localSettingPopoverParams;
    }

    private getLocalSettingFromStorage<T>(): QueryLocalSetting<T> {
        return this._localSettingsService.getUserSetting<QueryLocalSetting<T>>(this._settingName);
    }

    private openPromptDialog(): void {
        this._popoverDialog.open();
    }

    private onPopoverButtonClick<T>(
        result: DialogResult,
        settingValueResolver: (result: LocalSettingPromptDialogResult) => T
    ): void {
        const value = this.resolveValue<T>(result.returnValue as LocalSettingPromptDialogResult, settingValueResolver);
        this.setUserSetting<T>(value);
    }

    private resolveValue<T>(
        returnValue: LocalSettingPromptDialogResult,
        settingValueResolver: (result: LocalSettingPromptDialogResult) => T
    ): T {
        return settingValueResolver(returnValue);
    }

    private createSettingData<T>(value: T): QueryLocalSetting<T> {
        const settingData = new QueryLocalSetting<T>(value);
        settingData.isQueried = true;
        return settingData;
    }

    private setUserSetting<T>(value: T): void {
        const settingData = this.createSettingData<T>(value);
        this._localSettingsService.setUserSetting(this._settingName, settingData);
    }
}

export class LocalSettingPromptServiceParams<T> {
    public settingName: string;
    public popoverDialog: PopoverDialog;
    public popoverParams: PopoverDialogParams;
    public settingValueResolver: (result: LocalSettingPromptDialogResult) => T;

    constructor(
        settingName: string,
        popoverDialog: PopoverDialog,
        popoverParams: PopoverDialogParams,
        settingValueResolver: (result: LocalSettingPromptDialogResult) => T
    ) {
        this.settingName = settingName;
        this.popoverDialog = popoverDialog;
        this.popoverParams = popoverParams;
        this.settingValueResolver = settingValueResolver;
    }
}

export class LocalSettingPromptDialogResult {
    public buttonId: string;
}
