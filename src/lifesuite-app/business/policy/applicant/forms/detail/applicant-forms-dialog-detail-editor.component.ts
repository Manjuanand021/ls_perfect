import { Component, Injectable, Injector } from '@angular/core';

import { ParentChildRegistry } from 'life-core/view-model';
import { BasePolicyDialogDetailViewModel } from 'business/policy/shared/master-detail';
import { DialogData } from 'life-core/component';
import { ListUtil } from 'life-core/util';
import { AuthorizationProvider } from 'life-core/authorization';

import { ApplicantQuestionDTO } from 'ls-core/model';

import { ApplicantAuthorizationProvider } from 'business/policy/applicant/applicant-authorization.provider';

@Component({
    selector: 'applicant-forms-dialog-detail-editor',
    templateUrl: './applicant-forms-dialog-detail-editor.component.html',
    providers: [ParentChildRegistry, { provide: AuthorizationProvider, useClass: ApplicantAuthorizationProvider }]
})
@Injectable()
export class ApplicantFormsDialogDetailEditor extends BasePolicyDialogDetailViewModel<ApplicantQuestionDTO> {
    constructor(injector: Injector) {
        super(injector);
        this.listData.AnswerSet = new Array();
    }

    public setModel(model: DialogData): void {
        super.setModel(model);
        this.listData.AnswerSet = ListUtil.convertToListItems(
            this.resolvedData.metaData[`Answer Set ${this.data.AnswerSetName}`],
            'label',
            'value'
        );
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
        if (this.isDirty()) {
            this.data.IsModified = true;
        }
    }
}
