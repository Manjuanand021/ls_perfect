import { Injectable, Injector } from '@angular/core';

import { NavigationSequenceFactory } from 'ls-core/auto-navigation/navigation-sequence-factory';
import { NavigationSequenceType } from 'ls-core/auto-navigation/navigation-sequence-type';
import { ReferralProxyDTO } from 'ls-core/model';
import { INavigationSequence } from 'ls-core/model/auto-navigation';

import { LsRoutePath } from 'ui/routing/ls-route-path';
import { OpenTaskDelegateBase } from './open-task-delegate-base';
import { AutoNavigationChannels } from 'business/shared/auto-navigation';

@Injectable()
export class OpenInboxOutboxTaskDelegate extends OpenTaskDelegateBase {
    constructor(injector: Injector) {
        super(injector);
    }

    public openTask(taskProxy: any): void {
        const referralProxy = taskProxy as ReferralProxyDTO;

        const navigationSequence = this.createNavigationSequence(referralProxy);
        this.messagingService.publish(AutoNavigationChannels.CaseNotes, navigationSequence);
        this.navigateToTargetPage(taskProxy, LsRoutePath.CaseNotes);
    }

    protected createNavigationSequence(taskProxy: any): INavigationSequence {
        return NavigationSequenceFactory.getNavigationSequence(taskProxy, NavigationSequenceType.NOTES);
    }
}
