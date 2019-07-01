import { Injectable, Injector } from '@angular/core';

import { NavigationSequenceFactory } from 'ls-core/auto-navigation/navigation-sequence-factory';
import { NavigationSequenceType } from 'ls-core/auto-navigation/navigation-sequence-type';
import { INavigationSequence } from 'ls-core/model/auto-navigation';
import { DiaryActivityProxyDTO } from 'ls-core/model/dto/diary-activity-proxy.dto';

import { AutoNavigationChannels } from 'business/shared/auto-navigation';
import { LsRoutePath } from 'ui/routing/ls-route-path';
import { OpenTaskDelegateBase } from './open-task-delegate-base';

@Injectable()
export class OpenDiaryActivityTaskDelegate extends OpenTaskDelegateBase {
    constructor(injector: Injector) {
        super(injector);
    }

    public openTask(taskProxy: any): void {
        const diaryActivityProxy = taskProxy as DiaryActivityProxyDTO;

        const navigationSequence = this.createNavigationSequence(diaryActivityProxy);
        this.messagingService.publish(AutoNavigationChannels.CaseNotes, navigationSequence);
        this.navigateToTargetPage(taskProxy, LsRoutePath.CaseNotes);
    }

    protected createNavigationSequence(taskProxy: any): INavigationSequence {
        return NavigationSequenceFactory.getNavigationSequence(taskProxy, NavigationSequenceType.NOTES);
    }
}
