import { Injectable } from '@angular/core';

import { NameFormatter, CurrencyFormatter } from 'life-core/util/formatter';
import { NamePattern } from 'life-core/util/formatter/name-pattern';
import { I18n } from 'life-core/i18n';

import { InsuredDTO } from 'ls-core/model';
import { GetYesNoStringPipe } from 'ls-core/util';

@Injectable()
export class InsuredHeaderBuilder {
    private _nameFormatter: NameFormatter;
    private _currencyFormatter: CurrencyFormatter;
    private i18n: I18n;

    constructor(nameFormatter: NameFormatter, currencyFormatter: CurrencyFormatter, i18n: I18n) {
        this._nameFormatter = nameFormatter;
        this._currencyFormatter = currencyFormatter;
        this.i18n = i18n;
    }

    public getHeader(applicantStatus: any, insured: InsuredDTO): string {
        const coverage = insured.Coverages_LazyLoad ? insured.Coverages_LazyLoad[0] : null;

        const applicantName = this._nameFormatter.format(
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
                value: 'Applicant: {{applicantName}}{{headerItemSeparator}}',
                id: 'applicant.worksheet.app'
            },
            { applicantName: applicantName, headerItemSeparator: HeaderItemSeparator }
        )} ${this.i18n(
            {
                value: 'UW Amount: {{formattedUWAmount}}{{headerItemSeparator}}',
                id: 'applicant.worksheet.uwamt'
            },
            { formattedUWAmount: formattedUWAmount, headerItemSeparator: HeaderItemSeparator }
        )} ${this.i18n(
            {
                value: 'Issued Age: {{issuedAge}}{{headerItemSeparator}}',
                id: 'applicant.worksheet.issage'
            },
            {
                issuedAge: coverage ? insured.Coverages_LazyLoad[0].issueAge : '',
                headerItemSeparator: HeaderItemSeparator
            }
        )} ${this.i18n(
            {
                value: 'Smoker: {{isSmoker}}{{headerItemSeparator}}',
                id: 'applicant.worksheet.smoker'
            },
            {
                isSmoker: coverage ? new GetYesNoStringPipe().transform(insured.Coverages_LazyLoad[0].IsSmoker) : '',
                headerItemSeparator: HeaderItemSeparator
            }
        )} ${this.i18n(
            {
                value: 'Status: {{codeValue}}',
                id: 'applicant.worksheet.status'
            },
            { codeValue: applicantStatus.CodeValue }
        )} `;
    }
}

const StringCodeValue = 160;
const NumberOfRepeats = 10;

const HeaderItemSeparator: string = String.fromCharCode(StringCodeValue).repeat(NumberOfRepeats);
