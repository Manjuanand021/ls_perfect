import { Inject, Injectable } from '@angular/core';
import { FormatWidth } from '@angular/common';

import { LOCALE_ID } from 'life-core/i18n';
import { DateFormatRetriever } from 'life-core/util/formatter';
import { LsAppConfig, SystemSetting } from 'ls-core/config';

@Injectable()
export class LsDateFormatRetriever extends DateFormatRetriever {
    // Short date format defined in LS system settings in database.
    // If defined, it will override locale date format.
    private _lsShortDateFormat: string;

    // Time format defined in LS system settings in database.
    // If defined, it will override locale date format.
    private _lsTimeFormat: string;

    constructor(@Inject(LOCALE_ID) localeId: string, lsAppConfig: LsAppConfig) {
        super(localeId);
        this.setLsFormats(lsAppConfig);
    }

    private setLsFormats(lsAppConfig: LsAppConfig): void {
        this._lsShortDateFormat = lsAppConfig.getSystemSetting(SystemSetting.HtmlDateFormat);
        this._lsTimeFormat = lsAppConfig.getSystemSetting(SystemSetting.HtmlTimeFormat);
    }

    public getLocaleDateFormat(localeId: string, formatWidth: FormatWidth): string {
        return this._lsShortDateFormat ? this._lsShortDateFormat : super.getLocaleDateFormat(localeId, formatWidth);
    }

    public getLocaleTimeFormat(localeId: string, formatWidth: FormatWidth): string {
        return this._lsTimeFormat ? this._lsTimeFormat : super.getLocaleTimeFormat(localeId, formatWidth);
    }
}
