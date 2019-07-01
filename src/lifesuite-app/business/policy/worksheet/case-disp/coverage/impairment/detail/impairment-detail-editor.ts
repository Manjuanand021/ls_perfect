import { Component, Injector, Injectable } from '@angular/core';

import { BasePolicyDialogDetailViewModel } from 'business/policy/shared/master-detail';
import { ListItem } from 'life-core/model';
import { ListUtil } from 'life-core/util';
import { AuthorizationProvider } from 'life-core/authorization';
import { ParentChildRegistry } from 'life-core/view-model';

import { ImpairmentRestrictionDTO } from 'ls-core/model';

import { CoverageAuthorizationProvider } from './../../coverage-authorization.provider';

@Component({
    selector: 'impairment-detail-editor',
    templateUrl: './impairment-detail-editor.html',
    providers: [ParentChildRegistry, { provide: AuthorizationProvider, useClass: CoverageAuthorizationProvider }]
})
@Injectable()
export class ImpairmentDialogDetailEditor extends BasePolicyDialogDetailViewModel<ImpairmentRestrictionDTO> {
    public isRestrictionSelectionDisabled: boolean;
    constructor(injector: Injector) {
        super(injector);
        this.isRestrictionSelectionDisabled = false;
    }

    protected setupData(): void {
        this.setRestrictionCodeDisability();
    }

    public onImpairmentChange(selectedImpairment: any): void {
        const selectedImpairmentValue: string = selectedImpairment.value;
        const impairmentDropdownList: ListItem[] = ListUtil.convertToListItems(
            this.resolvedData.listData.ImpairmentRestrictionCode
        );
        const selectedImpairmentText: string = ListUtil.getLabelByValue(
            impairmentDropdownList,
            selectedImpairmentValue
        );

        this.data.ImpairmentText =
            selectedImpairmentText && selectedImpairmentText.length > 0
                ? selectedImpairmentText.substr(selectedImpairmentValue.length + 1)
                : '';
    }

    private setRestrictionCodeDisability(): void {
        this.isRestrictionSelectionDisabled = this.data.ImpairmentRestrictionCode ? true : false;
    }
}
