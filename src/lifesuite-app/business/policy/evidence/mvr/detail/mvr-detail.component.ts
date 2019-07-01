import { Component, Injector } from '@angular/core';

import { DetailViewModel } from 'life-core/component/master-detail';

import { NameUtil } from 'life-core/util';
import { MVRDetailDTO, MVRDTO } from 'ls-core/model';

@Component({
    selector: 'mvr-detail',
    templateUrl: './mvr-detail.component.html'
})
export class MVRDetailComponent extends DetailViewModel<MVRDTO> {
    public violationData: MVRDetailDTO[];
    public fullName: string;

    constructor(injector: Injector) {
        super(injector);
    }

    public setModel(model: MVRDTO): void {
        this.setContext(model);
    }

    private setContext(context: MVRDTO): void {
        this.data = context;
        this.violationData = this.data.Details_LazyLoad;
        this.fullName = this.getFullName();
    }

    private getFullName(): string {
        return NameUtil.getFullNameWithMiddleInitial({
            firstName: this.data.FirstName,
            middleName: this.data.MiddleName,
            lastName: this.data.LastName
        });
    }
}
