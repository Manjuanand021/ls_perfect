import { Injectable, Injector } from '@angular/core';

import { LsRoutePath } from 'ui/routing';
import { NavigationSequenceFactory } from 'ls-core/auto-navigation/navigation-sequence-factory';
import { NavigationSequenceType } from 'ls-core/auto-navigation/navigation-sequence-type';
import { RequirementProxy } from 'ls-core/model';
import { INavigationSequence } from 'ls-core/model/auto-navigation';
import { OpenTaskDelegateBase } from './open-task-delegate-base';
import { AutoNavigationChannels } from 'business/shared/auto-navigation';

@Injectable()
export class OpenRequirementsDelegate extends OpenTaskDelegateBase {
    constructor(injector: Injector) {
        super(injector);
    }

    public openTask(taskProxy: any): void {
        const navigationSequence = this.createNavigationSequence(taskProxy);
        this.messagingService.publish(AutoNavigationChannels.Requirement, navigationSequence);
        this.navigateToTargetPage(taskProxy as RequirementProxy, LsRoutePath.Requirements);
    }

    protected createNavigationSequence(taskProxy: any): INavigationSequence {
        return NavigationSequenceFactory.getNavigationSequence(taskProxy, NavigationSequenceType.REQUIREMENTS);
    }
}
