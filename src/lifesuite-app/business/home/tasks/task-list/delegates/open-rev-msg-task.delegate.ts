import { Injectable, Injector } from '@angular/core';

import { NavigationSequenceFactory } from 'ls-core/auto-navigation/navigation-sequence-factory';
import { NavigationSequenceType } from 'ls-core/auto-navigation/navigation-sequence-type';
import { INavigationSequence } from 'ls-core/model/auto-navigation';
import { OpenTaskDelegateBase } from './open-task-delegate-base';
import { AutoNavigationChannels } from 'business/shared/auto-navigation';
import { ReviewMessageProxyDTO } from 'ls-core/model/dto/review-message-proxy.dto';

@Injectable()
export class OpenRevMsgTaskDelegate extends OpenTaskDelegateBase {
    constructor(injector: Injector) {
        super(injector);
    }

    public openTask(taskProxy: any): void {
        const navigationSequence = this.createNavigationSequence(taskProxy);
        this.messagingService.publish(AutoNavigationChannels.PolicyTab, navigationSequence);
        this.navigateToTargetPage(taskProxy as ReviewMessageProxyDTO);
    }

    protected createNavigationSequence(taskProxy: any): INavigationSequence {
        return NavigationSequenceFactory.getNavigationSequence(taskProxy, NavigationSequenceType.REVIEW_MESSAGES);
    }
}
