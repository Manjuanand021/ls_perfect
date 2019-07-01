import { Injectable } from '@angular/core';

import { TabStateManager, TabStateValueAccessor } from 'life-core/util';
import { TabPolicyDataKeys } from 'business/policy/tab/state/tab-policy-data-keys';
import { ActiveApplicantHelper } from './active-applicant.helper';

/**
 * Initializes ActiveApplicantHelper.
 * Registered on TabView component to have access to TabStateManager.
 */
@Injectable()
export class ActiveApplicantHelperInitializer {
    constructor(activeApplicantHelper: ActiveApplicantHelper, tabStateManager: TabStateManager) {
        activeApplicantHelper.setApplicantIdStateValueAccessor(
            this.createApplicantIdStateValueAccessor(tabStateManager)
        );
    }

    private createApplicantIdStateValueAccessor(tabStateManager: TabStateManager): TabStateValueAccessor<number> {
        return new TabStateValueAccessor<number>(tabStateManager, TabPolicyDataKeys.ACTIVE_PARTICIPANT);
    }
}
