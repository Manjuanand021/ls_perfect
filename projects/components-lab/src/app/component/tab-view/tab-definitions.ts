import { TabDefinition, TabContainerType } from 'life-core/component/layout/tabview/model';

export enum PrimaryTabType {
	Home,
	Search,
	Policy
}

export enum SecondaryTabType {
	WorkItems,
	CaseDisposition,
	ReviewMessages,
	Notes,
	Details
}

export enum TabObjectType {
	Policy
}

// PRIMARY Tab Definitions
export const TabDefHome: TabDefinition = {
	name: 'tabHome',
	title: 'Home',
	tabType: PrimaryTabType.Home,
	containerType: TabContainerType.Primary,
	closable: false,
	validatable: false
}

export const TabDefSearch: TabDefinition = {
	name: 'tabSearch',
	title: 'Search',
	tabType: PrimaryTabType.Search,
	containerType: TabContainerType.Primary,
	closable: true,
	validatable: false
}

export const TabDefPolicy: TabDefinition = {
	name: 'tabPolicy',
	title: 'Policy',
	tabType: PrimaryTabType.Policy,
	tabObjectType: TabObjectType.Policy,
	containerType: TabContainerType.Primary,
	closable: true,
	validatable: true
}

// SECONDARY Tab Definitions
export const TabDefWorkItems: TabDefinition = {
	name: 'tabWorkItems',
	title: 'Work Items',
	tabType: SecondaryTabType.WorkItems,
	containerType: TabContainerType.Secondary,
	closable: false,
	validatable: false
}

export const TabDefCaseDisposition: TabDefinition = {
	name: 'tabCaseDisposition',
	title: 'Case Disposition',
	tabType: SecondaryTabType.CaseDisposition,
	tabObjectType: TabObjectType.Policy,
	containerType: TabContainerType.Secondary,
	closable: false,
	validatable: true
}

export const TabDefReviewMessages: TabDefinition = {
	name: 'tabReviewMessages',
	title: 'Review Messages',
	tabType: SecondaryTabType.ReviewMessages,
	tabObjectType: TabObjectType.Policy,
	containerType: TabContainerType.Secondary,
	closable: false,
	validatable: true
}

export const TabDefNotes: TabDefinition = {
	name: 'tabNotes',
	title: 'Notes',
	tabType: SecondaryTabType.Notes,
	tabObjectType: TabObjectType.Policy,
	containerType: TabContainerType.Secondary,
	closable: false,
	validatable: true
}

export const TabDefDetails: TabDefinition = {
	name: 'tabDetails',
	title: 'Policy Details',
	tabType: SecondaryTabType.Notes,
	tabObjectType: TabObjectType.Policy,
	containerType: TabContainerType.Secondary,
	closable: true,
	validatable: true
}

export class TabDefinitions {
// PRIMARY Tab Definitions
	static Home: TabDefinition = TabDefHome;
	static Search: TabDefinition = TabDefSearch;
	static Policy: TabDefinition = TabDefPolicy;
// SECONDARY Tab Definitions
	static WorkItems: TabDefinition = TabDefWorkItems;
	static CaseDesposition: TabDefinition = TabDefCaseDisposition;
	static ReviewMessages: TabDefinition = TabDefReviewMessages;
	static Notes: TabDefinition = TabDefNotes;
	static Details: TabDefinition = TabDefDetails;
}

