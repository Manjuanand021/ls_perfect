import { Injector } from '@angular/core';

import { IMessagingService, MessagingService } from 'life-core/messaging';

import { INavigationSequence } from 'ls-core/model/auto-navigation';
import { ConvertUtil } from 'life-core/util/lang';

import { OpenPolicyDelegate } from 'business/shared/open-policy';
import { IOpenTask } from './open-task.interface';

export abstract class OpenTaskDelegateBase implements IOpenTask {
    protected messagingService: IMessagingService;

    protected openPolicyDelegate: OpenPolicyDelegate;

    constructor(injector: Injector) {
        this.messagingService = injector.get(MessagingService);
        this.openPolicyDelegate = injector.get(OpenPolicyDelegate);
    }

    public abstract openTask(taskProxy: any): void;

    protected abstract createNavigationSequence(taskProxy: any): INavigationSequence;

    protected navigateToTargetPage(taskProxy: any, routePath?: string): void {
        this.openPolicyDelegate.openPolicy(ConvertUtil.toNumber(taskProxy.PolicyId), taskProxy.PolicyNumber, routePath);
    }
}
