import { Injectable, Injector } from '@angular/core';

import { LsRoutePath } from 'ui/routing';

import { ConvertUtil } from 'life-core/util/lang';
import { ILogger, Logger } from 'life-core/logging';

import { NavigationSequenceFactory } from 'ls-core/auto-navigation/navigation-sequence-factory';
import { NavigationSequenceType } from 'ls-core/auto-navigation/navigation-sequence-type';
import { PolicyProxyDTO } from 'ls-core/model';
import { INavigationSequence } from 'ls-core/model/auto-navigation';

import { AutoNavigationChannels } from 'business/shared/auto-navigation';
import { OpenTaskDelegateBase } from './open-task-delegate-base';
import { MIBTwoYearCountService } from '../mib-two-year.service';

@Injectable()
export class OpenMibTwoYrDelegate extends OpenTaskDelegateBase {
    private _mIBTwoYearCountService: MIBTwoYearCountService;
    private _logger: ILogger;

    constructor(injector: Injector, mIBTwoYearCountService: MIBTwoYearCountService, logger: Logger) {
        super(injector);
        this._mIBTwoYearCountService = mIBTwoYearCountService;
        this._logger = logger;
    }

    public openTask(task: any): void {
        const taskProxy = task as PolicyProxyDTO;
        const navigationSequence = this.createNavigationSequence(task);
        this.messagingService.publish(AutoNavigationChannels.Evidence, navigationSequence);
        this.navigateToTargetPage(taskProxy, LsRoutePath.Evidence);
        this.updateMIBTwoYearCount(ConvertUtil.toNumber(taskProxy.PolicyPersonId));
    }

    protected createNavigationSequence(task: any): INavigationSequence {
        return NavigationSequenceFactory.getNavigationSequence(task, NavigationSequenceType.MIB);
    }

    private updateMIBTwoYearCount(policyPersonID: number): void {
        this._mIBTwoYearCountService.update(policyPersonID).then(result => {
            this._logger.log('MIB Two year count updated successfully');
        });
    }
}
