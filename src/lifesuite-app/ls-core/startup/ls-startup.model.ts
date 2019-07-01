import { StartupContext } from 'life-core/startup';

export interface StartupForPolicyContext extends StartupContext {
    policyId: number;
}

export interface StartupForPolicyNotesContext extends StartupForPolicyContext {
    reviewMessageId: number;
}

export interface StartupForViewNotesContext extends StartupForPolicyContext {
    activeApplicantId: number;
}
