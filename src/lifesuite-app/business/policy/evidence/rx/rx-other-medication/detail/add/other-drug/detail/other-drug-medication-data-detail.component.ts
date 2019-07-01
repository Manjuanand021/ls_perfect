import { ViewModel } from 'life-core/view-model';
import { Component, Injector } from '@angular/core';
import { ICompose } from 'life-core/component';
import { MedicationDTO } from 'ls-core/model';
import { AuthorizationProvider } from 'life-core/authorization';
import { RxDetailAuthorizationProvider } from 'business/policy/evidence/rx/rx-other-medication/rx-detail-authorization.provider';
import { OtherMedicalConditionTypes } from 'business/policy/evidence/rx/rx.constants';

@Component({
    selector: 'other-drug-medication-data-detail',
    templateUrl: './other-drug-medication-data-detail.component.html',
    providers: [{ provide: AuthorizationProvider, useClass: RxDetailAuthorizationProvider }]
})
export class OtherDrugMedicationDataDetailComponent extends ViewModel<MedicationDTO> implements ICompose {
    constructor(injector: Injector) {
        super(injector);
    }

    public setModel(model: MedicationDTO): void {
        this.data = model;
    }

    onDrugNameBlur(): void {
        this.data.DrugName =
            this.data.DrugName.slice(0, 5) === 'Other'
                ? `${this.data.DrugName}`
                : `${OtherMedicalConditionTypes.Other}-${this.data.DrugName}`;
    }
}
