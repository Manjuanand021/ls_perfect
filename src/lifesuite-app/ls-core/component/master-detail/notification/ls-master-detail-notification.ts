import { Injectable } from '@angular/core';

import { MessagingService } from 'life-core/messaging';
import { LfMasterDetailNotification, MasterDetailViewModelResources } from 'life-core/component/master-detail';

@Injectable()
export class LsMasterDetailNotification<T> extends LfMasterDetailNotification<T> {
    constructor(messagingService: MessagingService, masterDetailViewModelResources: MasterDetailViewModelResources) {
        super(messagingService, masterDetailViewModelResources);
    }

    public notifyItemSaved(item: T): void {
        // override base method to do nothing because this is only an internal save
    }
}
