import { Component, Input, Injector } from '@angular/core';

import { RxRulesSummaryProxy, RXReportProxy } from 'ls-core/model';

import { OpenURLDelegate } from 'ls-core/handler/open-url-delegate';
import { LsAppConfig, SystemSetting } from 'ls-core/config';
import { AppSession } from 'ls-core/session';

@Component({
    selector: 'rx-web-buttons',
    templateUrl: './rx-web-buttons.component.html',
    styleUrls: ['./rx-web-buttons.component.css']
})
export class RxWebButtonsComponent {
    public _firstRxItem: RxRulesSummaryProxy | RXReportProxy;
    public disableWebButton: boolean;
    public disablePDFButton: boolean;

    private _openURLDelegate: OpenURLDelegate;
    private _appConfig: LsAppConfig;
    constructor(openURLDelegate: OpenURLDelegate, appConfig: LsAppConfig) {
        this._openURLDelegate = openURLDelegate;
        this._appConfig = appConfig;
    }

    @Input()
    public set firstRxItem(item: RxRulesSummaryProxy | RXReportProxy) {
        this._firstRxItem = item;
        this.setButtonsAvailability();
    }

    public onWebButtonClick(): void {
        if (this._firstRxItem && this._firstRxItem.OrderResultsUrl) {
            const destinationURL = this.getDestinationURL('web');
            this.openWebUrl(destinationURL);
        }
    }

    public onPdfButtonClick(): void {
        if (this._firstRxItem && this._firstRxItem.ImageFileName) {
            const destinationURL = this.getDestinationURL('pdf');
            this.openWebUrl(destinationURL);
        }
    }

    private openWebUrl(navigateUrl: string): void {
        this._openURLDelegate.openURL(navigateUrl);
    }

    private setButtonsAvailability(): void {
        this.disableWebButton = !this._firstRxItem.OrderResultsUrl;
        this.disablePDFButton = !this._firstRxItem.ImageFileName;
    }

    private getDestinationURL(reportType: string): string {
        let legacyUrl = this._appConfig.getSystemSetting(SystemSetting.LSLegacyUrl);
        legacyUrl += legacyUrl.endsWith('/') ? '' : '/';
        return `${legacyUrl}MillimanWebAccess/MillimanReportData.aspx?type=${reportType}&PdhId=${
            this._firstRxItem.PrescriptionDrugHeaderId
        }`;
    }
}
