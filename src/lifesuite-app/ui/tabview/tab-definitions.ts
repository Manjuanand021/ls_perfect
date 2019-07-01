import { TabDefinition, TabContainerType } from 'life-core/component/layout/tabview/model';
import { LsAppConfig } from 'ls-core/config/ls-app.config';

export enum PrimaryTabType {
    Home,
    Search,
    ReassignCase,
    Policy
}

export enum SecondaryTabType {
    WorkItems,
    Tasks,
    Summary,
    CaseDisposition,
    ReviewMessages,
    DebitCredit,
    Notes,
    Details,
    RequirementBasicInfo,
    RequirementProvidersInfo,
    Lab,
    MIB,
    MVR,
    Rx,
    MedicalCondition,
    Velogica,
    Paramedical,
    DocumentsAttachment,
    DocumentsTemplate
}

export enum TertiaryTabType {
    RxReport,
    RxRules,
    RxOtherMedication,
    MIBReport,
    MIBCoding
}

export enum TabObjectType {
    Policy
}

// PRIMARY Tab Definitions
export const TabDefHome: TabDefinition = {
    name: 'tabHome',
    tabType: PrimaryTabType.Home,
    containerType: TabContainerType.Primary,
    menuId: 'home',
    leftIcon: 'fa fa-home ls-tabview-home',
    closable: false,
    validatable: false
};

export const TabDefSearch: TabDefinition = {
    name: 'tabSearch',
    tabType: PrimaryTabType.Search,
    containerType: TabContainerType.Primary,
    menuId: 'searchCase',
    leftIcon: 'ls-tabview-searchcase',
    closable: true,
    validatable: false
};

export const TabDefReassignCase: TabDefinition = {
    name: 'tabReassignCase',
    tabType: PrimaryTabType.ReassignCase,
    containerType: TabContainerType.Primary,
    menuId: 'reassignCase',
    leftIcon: 'ls-tabview-reassigncase',
    closable: true,
    validatable: false
};

export const TabDefPolicy: TabDefinition = {
    name: 'tabPolicy',
    tabType: PrimaryTabType.Policy,
    tabObjectType: TabObjectType.Policy,
    containerType: TabContainerType.Primary,
    menuId: 'policy',
    leftIcon: 'ls-tabview-case',
    closable: true,
    validatable: true,
    maxNumberOfOpenTabs: LsAppConfig.maxNumberOfOpenPolicyTabs
};

// SECONDARY Tab Definitions
export const TabDefWorkItems: TabDefinition = {
    name: 'tabWorkItems',
    tabType: SecondaryTabType.WorkItems,
    containerType: TabContainerType.Secondary,
    closable: false,
    validatable: false
};

export const TabDefTasks: TabDefinition = {
    name: 'tabTasks',
    tabType: SecondaryTabType.Tasks,
    containerType: TabContainerType.Secondary,
    closable: false,
    validatable: false
};

export const TabDefSummary: TabDefinition = {
    name: 'tabSummary',
    tabType: SecondaryTabType.Summary,
    containerType: TabContainerType.Secondary,
    closable: false,
    validatable: false
};

export const TabDefCaseDisposition: TabDefinition = {
    name: 'tabCaseDisposition',
    tabType: SecondaryTabType.CaseDisposition,
    tabObjectType: TabObjectType.Policy,
    containerType: TabContainerType.Secondary,
    closable: false,
    validatable: true
};

export const TabDefReviewMessages: TabDefinition = {
    name: 'tabReviewMessages',
    tabType: SecondaryTabType.ReviewMessages,
    tabObjectType: TabObjectType.Policy,
    containerType: TabContainerType.Secondary,
    closable: false,
    validatable: true
};

export const TabDefDebitCredit: TabDefinition = {
    name: 'tabDebitCredit',
    tabType: SecondaryTabType.DebitCredit,
    tabObjectType: TabObjectType.Policy,
    containerType: TabContainerType.Secondary,
    closable: false,
    validatable: true
};

export const TabDefNotes: TabDefinition = {
    name: 'tabNotes',
    tabType: SecondaryTabType.Notes,
    tabObjectType: TabObjectType.Policy,
    containerType: TabContainerType.Secondary,
    closable: false,
    validatable: true
};

export const TabDefDetails: TabDefinition = {
    name: 'tabDetails',
    tabType: SecondaryTabType.Notes,
    tabObjectType: TabObjectType.Policy,
    containerType: TabContainerType.Secondary,
    closable: true,
    validatable: true
};

export const TabDefRequirementBasicInfo: TabDefinition = {
    name: 'tabRequirementBasicInfo',
    tabType: SecondaryTabType.RequirementBasicInfo,
    containerType: TabContainerType.Secondary,
    closable: false,
    validatable: false
};

export const TabDefRequirementProvidersInfo: TabDefinition = {
    name: 'tabRequirementProvidersInfo',
    tabType: SecondaryTabType.RequirementProvidersInfo,
    containerType: TabContainerType.Secondary,
    closable: false,
    validatable: false
};

export const TabDefLab: TabDefinition = {
    name: 'tabLab',
    tabType: SecondaryTabType.Lab,
    tabObjectType: TabObjectType.Policy,
    containerType: TabContainerType.Secondary,
    closable: false,
    validatable: true
};

export const TabDefMIB: TabDefinition = {
    name: 'tabMIB',
    tabType: SecondaryTabType.MIB,
    tabObjectType: TabObjectType.Policy,
    containerType: TabContainerType.Secondary,
    closable: false,
    validatable: true
};

export const TabDefRx: TabDefinition = {
    name: 'tabRx',
    tabType: SecondaryTabType.Rx,
    tabObjectType: TabObjectType.Policy,
    containerType: TabContainerType.Secondary,
    closable: false,
    validatable: true
};

export const TabDefMVR: TabDefinition = {
    name: 'tabMvr',
    tabType: SecondaryTabType.MVR,
    tabObjectType: TabObjectType.Policy,
    containerType: TabContainerType.Secondary,
    closable: false,
    validatable: true
};

export const TabDefParamedical: TabDefinition = {
    name: 'tabParamedical',
    tabType: SecondaryTabType.Paramedical,
    tabObjectType: TabObjectType.Policy,
    containerType: TabContainerType.Secondary,
    closable: false,
    validatable: true
};

export const TabDefMedicalCondition: TabDefinition = {
    name: 'tabMedicalCondition',
    tabType: SecondaryTabType.MedicalCondition,
    tabObjectType: TabObjectType.Policy,
    containerType: TabContainerType.Secondary,
    closable: false,
    validatable: true
};

export const TabDefVelogica: TabDefinition = {
    name: 'tabVelogica',
    tabType: SecondaryTabType.Velogica,
    tabObjectType: TabObjectType.Policy,
    containerType: TabContainerType.Secondary,
    closable: false,
    validatable: true
};

export const TabDefDocumentsAttachment: TabDefinition = {
    name: 'tabDocumentsAttachment',
    tabType: SecondaryTabType.DocumentsAttachment,
    tabObjectType: TabObjectType.Policy,
    containerType: TabContainerType.Secondary,
    closable: false,
    validatable: true
};

export const TabDefDocumentsTemplate: TabDefinition = {
    name: 'tabDocumentsTemplate',
    tabType: SecondaryTabType.DocumentsTemplate,
    tabObjectType: TabObjectType.Policy,
    containerType: TabContainerType.Secondary,
    closable: false,
    validatable: true
};

// TERTIARY Tab Definitions
export const TabDefRxReport: TabDefinition = {
    name: 'tabRxReport',
    tabType: TertiaryTabType.RxReport,
    tabObjectType: TabObjectType.Policy,
    containerType: TabContainerType.Tertiary,
    closable: false,
    validatable: true
};

export const TabDefRxRules: TabDefinition = {
    name: 'tabRxRules',
    tabType: TertiaryTabType.RxReport,
    tabObjectType: TabObjectType.Policy,
    containerType: TabContainerType.Tertiary,
    closable: false,
    validatable: true
};

export const TabDefRxOtherMedication: TabDefinition = {
    name: 'tabRxOtherMedication',
    tabType: TertiaryTabType.RxOtherMedication,
    tabObjectType: TabObjectType.Policy,
    containerType: TabContainerType.Tertiary,
    closable: false,
    validatable: true
};

export const TabDefMIBReport: TabDefinition = {
    name: 'tabMIBReport',
    tabType: TertiaryTabType.MIBReport,
    tabObjectType: TabObjectType.Policy,
    containerType: TabContainerType.Tertiary,
    closable: false,
    validatable: true
};

export const TabDefMIBCoding: TabDefinition = {
    name: 'tabMIBCoding',
    tabType: TertiaryTabType.MIBCoding,
    tabObjectType: TabObjectType.Policy,
    containerType: TabContainerType.Tertiary,
    closable: false,
    validatable: true
};

export const TabDefinitions = {
    // PRIMARY Tab Definitions
    Home: TabDefHome,
    Search: TabDefSearch,
    Policy: TabDefPolicy,
    ReassignCase: TabDefReassignCase,
    // SECONDARY Tab Definitions
    WorkItems: TabDefWorkItems,
    Tasks: TabDefTasks,
    Summary: TabDefSummary,
    CaseDesposition: TabDefCaseDisposition,
    ReviewMessages: TabDefReviewMessages,
    DebitCredit: TabDefDebitCredit,
    Notes: TabDefNotes,
    Details: TabDefDetails,
    RequirementBasicInfo: TabDefRequirementBasicInfo,
    RequirementProvidersInfo: TabDefRequirementProvidersInfo,
    Lab: TabDefLab,
    MIB: TabDefMIB,
    Rx: TabDefRx,
    Paramedical: TabDefParamedical,
    MedicalCondition: TabDefMedicalCondition,
    Velogica: TabDefVelogica,
    DocumentsAttachment: TabDefDocumentsAttachment,
    DocumentsTemplate: TabDefDocumentsTemplate,
    // TERTIARY Tab Definitions
    RxReport: TabDefRxReport,
    RxRules: TabDefRxRules,
    RxOtherMedication: TabDefRxOtherMedication,
    MIBReport: TabDefMIBReport,
    MIBCoding: TabDefMIBCoding,
    MVR: TabDefMVR
};
