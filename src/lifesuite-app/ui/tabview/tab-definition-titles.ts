import { Injectable } from '@angular/core';

import { TabDefinition } from 'life-core/component/layout/tabview/model';
import { I18n } from 'life-core/i18n';
import { TabDefinitions } from './tab-definitions';

@Injectable()
export class TabDefinitionTitles {
    private _map: { readonly [type: string]: string } = {};

    constructor(i18n: I18n) {
        this._map = {
            // PRIMARY Tab
            [TabDefinitions.Home.name]: i18n({ value: 'Home', id: 'tab.title.home' }),
            [TabDefinitions.Search.name]: i18n({ value: 'Search', id: 'tab.title.search' }),
            [TabDefinitions.Policy.name]: i18n({ value: 'Case', id: 'tab.title.case' }),
            [TabDefinitions.ReassignCase.name]: i18n({ value: 'Reassign Case', id: 'tab.title.reassign-case' }),
            // SECONDARY Tab
            [TabDefinitions.WorkItems.name]: i18n({ value: 'Work Items', id: 'tab.title.work-items' }),
            [TabDefinitions.Tasks.name]: i18n({ value: 'Tasks', id: 'tab.title.tasks' }),
            [TabDefinitions.Summary.name]: i18n({ value: 'Summary', id: 'tab.title.summary' }),
            [TabDefinitions.CaseDesposition.name]: i18n({
                value: 'Case Disposition',
                id: 'tab.title.case-disposition'
            }),
            [TabDefinitions.ReviewMessages.name]: i18n({ value: 'Review Messages', id: 'tab.title.review-messages' }),
            [TabDefinitions.DebitCredit.name]: i18n({ value: 'Debit/Credit', id: 'tab.title.debit-credit' }),
            [TabDefinitions.Notes.name]: i18n({ value: 'Notes', id: 'tab.title.notes' }),
            [TabDefinitions.Details.name]: i18n({ value: 'Policy Details', id: 'tab.title.policy-details' }),
            [TabDefinitions.RequirementBasicInfo.name]: i18n({
                value: 'Basic Information',
                id: 'tab.title.requirement-basic-info'
            }),
            [TabDefinitions.RequirementProvidersInfo.name]: i18n({
                value: 'Providers Information',
                id: 'tab.title.requirement-providers-info'
            }),
            [TabDefinitions.Lab.name]: i18n({ value: 'Lab', id: 'tab.title.lab' }),
            [TabDefinitions.MIB.name]: i18n({ value: 'M I B', id: 'tab.title.mib' }),
            [TabDefinitions.Rx.name]: i18n({ value: 'Rx', id: 'tab.title.rx' }),
            [TabDefinitions.MVR.name]: i18n({ value: 'MVR', id: 'tab.title.mvr' }),
            [TabDefinitions.Paramedical.name]: i18n({ value: 'Paramedical', id: 'tab.title.paramedical' }),
            [TabDefinitions.MedicalCondition.name]: i18n({
                value: 'Medical Condition',
                id: 'tab.title.medical-condition'
            }),
            [TabDefinitions.Velogica.name]: i18n({ value: 'Velogica', id: 'tab.title.velogica' }),
            [TabDefinitions.DocumentsAttachment.name]: i18n({
                value: 'Attachments',
                id: 'tab.title.documents-attachment'
            }),
            [TabDefinitions.DocumentsTemplate.name]: i18n({ value: 'Templates', id: 'tab.title.templates' }),
            // TERTIARY Tab
            [TabDefinitions.RxReport.name]: i18n({ value: 'Rx Report', id: 'tab.title.rx-report' }),
            [TabDefinitions.RxRules.name]: i18n({ value: 'RxRules Summary', id: 'tab.title.rx-rules' }),
            [TabDefinitions.RxOtherMedication.name]: i18n({
                value: 'Other Medication',
                id: 'tab.title.rx-other-medication'
            }),
            [TabDefinitions.MIBReport.name]: i18n({ value: 'MIB Report', id: 'tab.title.mib-report' }),
            [TabDefinitions.MIBCoding.name]: i18n({ value: 'MIB Coding', id: 'tab.title.mib-coding' })
        };
    }

    public getTitle(tabDefinition: TabDefinition): string {
        return this._map[tabDefinition.name];
    }
}
