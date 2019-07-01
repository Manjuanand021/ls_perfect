import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { LifeError, IErrorHandler, ErrorHandlerChannels } from 'life-core/service';
import { MessagingService, BaseSubcriber } from 'life-core/messaging';
import { ToasterMessage, ToasterSeverity, ToasterChannels } from 'life-core/component/toaster';

@Injectable()
export class SystemErrorHandler extends BaseSubcriber implements IErrorHandler, OnDestroy {
    private _messagingService: MessagingService;
    private _messagingSubscription: Subscription;

    constructor(messagingService: MessagingService) {
        super();
        this._messagingService = messagingService;
    }

    public register(): void {
        this._messagingSubscription = this._messagingService.subscribe2(ErrorHandlerChannels.CriticalError, this);
    }

    public receive(payload: LifeError[]): void {
        const messages: Array<ToasterMessage> = payload.map(error => {
            return new ToasterMessage({
                severity: ToasterSeverity.ERROR,
                summary: error.errorMessage
            });
        });
        this._messagingService.publish(ToasterChannels.StickyMessage, messages);
    }

    public filter(payload: any): boolean {
        return false;
    }

    public ngOnDestroy(): void {
        this._messagingSubscription.unsubscribe();
    }
}
