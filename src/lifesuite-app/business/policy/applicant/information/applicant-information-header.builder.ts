import { Injectable } from '@angular/core';

import { NameFormatter, CurrencyFormatter } from 'life-core/util/formatter';
import { NamePattern } from 'life-core/util';
import { I18n } from 'life-core/i18n';

import { InsuredDTO } from 'ls-core/model';
import { GetYesNoStringPipe } from 'ls-core/util';

import { HeaderItemSeparator } from 'business/policy/shared';

@Injectable()
export class ApplicantInfoHeaderBuilder {
    private _nameFormatter: NameFormatter;
    private _currencyFormatter: CurrencyFormatter;
    private i18n: I18n;

    constructor(nameFormatter: NameFormatter, currencyFormatter: CurrencyFormatter, i18n: I18n) {
        this._nameFormatter = nameFormatter;
        this._currencyFormatter = currencyFormatter;
        this.i18n = i18n;
    }

    public getApplicantInfoHeader(insured: InsuredDTO, applicantStatus: any): string {
        const coverage = insured.Coverages_LazyLoad ? insured.Coverages_LazyLoad[0] : null;

        const insuredFullName = this._nameFormatter.format(
            NamePattern.NameWithTitleSuffixAndMiddleInitial,
            insured.FirstName,
            insured.LastName,
            insured.MiddleName,
            insured.Title,
            insured.Suffix
        );
        const uwAmount = insured.UnderwritingAmount ? insured.UnderwritingAmount : 0;
        const formattedUWAmount = this._currencyFormatter.format(uwAmount);
        return `
        ${this.i18n(
            {
                value: 'Applicant Info: {{insuredFullName}}{{headerItemSeparator}}',
                id: 'applicant.info.title'
            },
            { insuredFullName: insuredFullName, headerItemSeparator: HeaderItemSeparator }
        )} ${this.i18n(
            {
                value: 'UW Amount: {{formattedUWAmount}}{{headerItemSeparator}}',
                id: 'applicant.info.uwamt'
            },
            { formattedUWAmount: formattedUWAmount, headerItemSeparator: HeaderItemSeparator }
        )} ${this.i18n(
            {
                value: 'Applicant Status: {{codeValue}}{{headerItemSeparator}}',
                id: 'applicant.info.status'
            },
            { codeValue: applicantStatus.CodeValue, headerItemSeparator: HeaderItemSeparator }
        )} ${this.i18n(
            {
                value: 'Issued Age: {{issuedAge}}{{headerItemSeparator}}',
                id: 'applicant.info.issage'
            },
            { issuedAge: coverage ? coverage.issueAge : '', headerItemSeparator: HeaderItemSeparator }
        )} ${this.i18n(
            {
                value: 'Smoker: {{isSmoker}}',
                id: 'applicant.info.smoker'
            },
            { isSmoker: coverage ? new GetYesNoStringPipe().transform(coverage.IsSmoker) : '' }
        )}
		`;
    }
}
