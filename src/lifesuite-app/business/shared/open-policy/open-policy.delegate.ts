import { Injectable } from '@angular/core';

import { TabChannels, TabDescriptorFactory } from 'life-core/component/layout/tabview';
import { IMessagingService, MessagingService } from 'life-core/messaging';
import { ILogger, Logger } from 'life-core/logging';
import { PolicyProxy } from 'ls-core/model';
import { LsTabDescriptorFactory } from 'ui/tabview';
import { LsAppConfig } from 'ls-core/config';
import { CaseGroupHubService } from 'business/shared/signalr';
import { LogPerformanceDelegate } from 'business/policy/shared/log-performance/log-performance.delegate';

@Injectable()
export class OpenPolicyDelegate {
    private _messagingService: IMessagingService;
    private _caseGroupHubService: CaseGroupHubService;
    private _logPerformanceDelegate: LogPerformanceDelegate;
    private _tabDescriptorFactory: LsTabDescriptorFactory;
    private _logger: ILogger;

    constructor(
        messagingService: MessagingService,
        caseGroupHubService: CaseGroupHubService,
        logPerformanceDelegate: LogPerformanceDelegate,
        tabDescriptorFactory: TabDescriptorFactory,
        logger: Logger
    ) {
        this._messagingService = messagingService;
        this._caseGroupHubService = caseGroupHubService;
        this._logPerformanceDelegate = logPerformanceDelegate;
        this._tabDescriptorFactory = tabDescriptorFactory as LsTabDescriptorFactory;
        this._logger = logger;
    }

    public openPolicy(policy: PolicyProxy, contentRoute?: string): void;
    public openPolicy(policyId: number, policyNumber: string, contentRoute?: string): void;
    public openPolicy(policyObjectOrId: PolicyProxy | number, policyNumber?: string, contentRoute?: string): void {
        let policyId: number;
        if (typeof policyObjectOrId == 'object') {
            policyId = (policyObjectOrId as PolicyProxy).PolicyId as number;
            policyNumber = (policyObjectOrId as PolicyProxy).PolicyNumber;
        } else {
            policyId = policyObjectOrId;
        }
        this.capturePerformanceMetrics(policyNumber);
        this._logger.log(`Policy Id: ${policyId}`);
        const tabPolicy = this._tabDescriptorFactory.createPrimaryTabDescriptorPolicy(
            policyId,
            policyNumber,
            contentRoute
        );
        tabPolicy.maxNumberOfOpenTabs = LsAppConfig.maxNumberOfOpenPolicyTabs;
        tabPolicy.selected = true;
        this._messagingService.publish(TabChannels.AddPrimaryTab, tabPolicy);
        if (this._caseGroupHubService.isConnected()) {
            this._caseGroupHubService.joinCaseGroup(policyNumber);
        }
    }

    private capturePerformanceMetrics(policyNumber: string): void {
        this._logPerformanceDelegate.log(true, policyNumber, 'caseOpen');
    }
}
