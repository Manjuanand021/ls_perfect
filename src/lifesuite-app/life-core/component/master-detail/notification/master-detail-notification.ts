import { Injectable } from '@angular/core';

import { ToasterMessage, ToasterSeverity, ToasterChannels } from 'life-core/component/toaster';
import { IMessagingService, MessagingService } from 'life-core/messaging';
import { MasterDetailViewModelResources } from '../view-model/master-detail.rc';

export interface IMasterDetailNotification<T> {
    notifyItemCreated(item: T): void;
    notifyItemRemoved(item: T): void;
    notifyItemCanceled(item: T): void;
    notifyItemSaved(item: T): void;
}

export abstract class MasterDetailNotification<T> implements IMasterDetailNotification<T> {
    constructor() {}

    public abstract notifyItemCreated(item: T): void;

    public abstract notifyItemRemoved(item: T): void;

    public abstract notifyItemCanceled(item: T): void;

    public abstract notifyItemSaved(item: T): void;
}

@Injectable()
export class LfMasterDetailNotification<T> extends MasterDetailNotification<T> {
    protected messagingService: IMessagingService;

    protected masterDetailViewModelResources: MasterDetailViewModelResources;

    constructor(messagingService: MessagingService, masterDetailViewModelResources: MasterDetailViewModelResources) {
        super();
        this.messagingService = messagingService;
        this.masterDetailViewModelResources = masterDetailViewModelResources;
    }

    public notifyItemCreated(item: T): void {
        this.setToasterMessage(
            new ToasterMessage({
                severity: ToasterSeverity.SUCCESS,
                summary: this.masterDetailViewModelResources.getItemCreatedMessage()
            })
        );
    }

    public notifyItemRemoved(item: T): void {
        this.setToasterMessage(
            new ToasterMessage({
                severity: ToasterSeverity.SUCCESS,
                summary: this.masterDetailViewModelResources.getItemDeletedMessage()
            })
        );
    }

    public notifyItemCanceled(item: T): void {
        this.setToasterMessage(
            new ToasterMessage({
                severity: ToasterSeverity.SUCCESS,
                summary: this.masterDetailViewModelResources.getItemChangesCanceledMessage()
            })
        );
    }

    public notifyItemSaved(item: T): void {
        this.setToasterMessage(
            new ToasterMessage({
                severity: ToasterSeverity.SUCCESS,
                summary: this.masterDetailViewModelResources.getItemSavedMessage()
            })
        );
    }

    protected setToasterMessage(message: ToasterMessage): void {
        this.messagingService.publish(ToasterChannels.Message, message);
    }
}
