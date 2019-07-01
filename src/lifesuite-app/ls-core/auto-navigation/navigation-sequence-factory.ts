import { INavigationSequence, NavigationTarget, NavigationTargetTypes } from 'ls-core/model/auto-navigation';
import { RequirementProxy, ReferralProxyDTO } from 'ls-core/model';
import { NavigationSequence } from 'ls-core/model/auto-navigation/navigation-sequence';

import { NavigationSequenceType } from './navigation-sequence-type';

const NavigatorID = {
    PolicyTab: 'PolicyTab',
    Requirements: 'Requirements',
    Mib: 'MIB'
};

function createNavigationTarget(
    navigatorId: string,
    targetType: NavigationTargetTypes = NavigationTargetTypes.Tab
): NavigationTarget {
    const navigationTarget = new NavigationTarget();
    navigationTarget.navigatorId = navigatorId;
    navigationTarget.targetType = targetType;
    return navigationTarget;
}

function createNavigationSequenceForNotesAndMessages(target: any): INavigationSequence {
    const navigationSequence: INavigationSequence = new NavigationSequence();
    navigationSequence.addNavigationTarget(createNavigationTarget(NavigatorID.PolicyTab));
    return navigationSequence;
}

function createNavigationSequenceForRequirements(target: any): INavigationSequence {
    const requirement: RequirementProxy = target as RequirementProxy;
    const navigationSequence: INavigationSequence = new NavigationSequence();
    const navigationTarget = createNavigationTarget(NavigatorID.Requirements, NavigationTargetTypes.CollectionItem);
    navigationTarget.addParam(NavigationTarget.PARAM_PERSON_ID, requirement.PolicyPersonId);
    navigationTarget.addParam(NavigationTarget.PARAM_COLLECTION_ITEM_ID, requirement.InsuredRequirementId.toString());
    navigationSequence.addNavigationTarget(navigationTarget);

    return navigationSequence;
}

function createNavigationSequenceForNotes(target: any): INavigationSequence {
    const note: ReferralProxyDTO = target as ReferralProxyDTO;
    const navigationSequence: INavigationSequence = new NavigationSequence();
    const navigationTarget = createNavigationTarget(NavigatorID.PolicyTab, NavigationTargetTypes.CollectionItem);
    navigationTarget.addParam(NavigationTarget.PARAM_TARGET_ID, note.NoteId);
    navigationSequence.addNavigationTarget(navigationTarget);

    return navigationSequence;
}

function createNavigationSequenceForMIBEvidence(target: any): INavigationSequence {
    const navigationSequence: INavigationSequence = new NavigationSequence();
    const navigationTarget = createNavigationTarget(NavigatorID.Mib);
    navigationTarget.addParam(NavigationTarget.PARAM_TARGET_ID, 'tabMIB');
    navigationSequence.addNavigationTarget(navigationTarget);
    return navigationSequence;
}

const NavigationSequenceMap = {
    [NavigationSequenceType.NOTES]: createNavigationSequenceForNotes,
    [NavigationSequenceType.REQUIREMENTS]: createNavigationSequenceForRequirements,
    [NavigationSequenceType.MIB]: createNavigationSequenceForMIBEvidence,
    [NavigationSequenceType.REVIEW_MESSAGES]: createNavigationSequenceForNotesAndMessages
};

export class NavigationSequenceFactory {
    constructor() {}

    public static getNavigationSequence(target: any, sequenceType: string): INavigationSequence {
        const navigationSequenceCreationHandler = NavigationSequenceMap[sequenceType];
        return navigationSequenceCreationHandler(target);
    }
}
