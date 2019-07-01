import { Component, Injector, Injectable } from '@angular/core';

import { ViewModel, ParentChildRegistry } from 'life-core/view-model';
import { ICompose } from 'life-core/component/compose';
import { EvidenceStatusDTO, MetadataItem } from 'ls-core/model';
import { IDialogViewModel, DialogViewModelResult } from 'life-core/component/dialog';

@Component({
    selector: 'requirement-history',
    templateUrl: './requirement-history.component.html',
    providers: [ParentChildRegistry]
})
@Injectable()
export class RequirementHistoryComponent extends ViewModel implements ICompose, IDialogViewModel {
    public ausUsers: MetadataItem[];

    public evidenceStatusListData: EvidenceStatusDTO[];

    constructor(injector: Injector) {
        super(injector);
    }

    public setModel(model: any): void {
        this.ausUsers = model.resolvedData.metaData['aus_users'];
        this.evidenceStatusListData = model.parameterData || [];
    }

    public loadData(): Promise<void> {
        this.setResolvedMetaData();
        return Promise.resolve();
    }

    public onDialogButtonClick(buttonId: string): Promise<DialogViewModelResult> {
        return Promise.resolve(null);
    }
}
