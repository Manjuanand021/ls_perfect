import { Injectable } from '@angular/core';

import { IMessagingService, MessagingService } from 'life-core/messaging';
import { ToasterChannels, ToasterMessage, ToasterSeverity } from 'life-core/component/toaster';
import { SignalRServiceRegistry } from 'life-core/signalr';
import { Logger } from 'life-core/logging';
import { LsSignalRService } from 'ls-core/signalr';

@Injectable()
export class CaseGroupHubService extends LsSignalRService {
    private _messagingService: IMessagingService;

    constructor(signalRServiceRegistry: SignalRServiceRegistry, messagingService: MessagingService, logger: Logger) {
        super(signalRServiceRegistry, logger);
        this._messagingService = messagingService;
    }

    public joinCaseGroup(caseNumber: string): void {
        this.invoke(CaseGroupHubMethods.JoinCaseGroup, caseNumber);
    }

    protected get connectionUrl(): string {
        return CaseGroupConnectionUrl;
    }

    protected initSubscribers(): void {
        this.subscribe(CaseGroupHubSubscribers.BroadcastToCaseGroup, (message: string) => {
            this._messagingService.publish(
                ToasterChannels.Message,
                new ToasterMessage({
                    severity: ToasterSeverity.INFO,
                    summary: '',
                    detail: message
                })
            );
            this.logger.log(`Received SignalR message : ${message}`);
        });
    }

    protected onConnectionStarted(): void {
        super.onConnectionStarted();
        this._messagingService.publish(
            ToasterChannels.Message,
            new ToasterMessage({
                severity: ToasterSeverity.INFO,
                summary: 'CaseGroup Hub',
                detail: 'CaseGroup Hub started.'
            })
        );
    }
}

const CaseGroupConnectionUrl = '/caseMessageProcessorHub';

const CaseGroupHubMethods = {
    JoinCaseGroup: 'joinCaseGroup'
};

const CaseGroupHubSubscribers = {
    BroadcastToCaseGroup: 'OnBroadcastToCaseGroup'
};
