import { Injector, Injectable } from '@angular/core';

import { ViewModel } from 'life-core/view-model';
import { ICompose } from 'life-core/component/compose';

import { BeneficiaryDTO } from 'ls-core/model/dto/beneficiary.dto';
import { ListDataUtil } from 'ls-core/service';

@Injectable()
export class BeneficiaryTypeComponent extends ViewModel<BeneficiaryDTO> implements ICompose {
    public beneType:string = null;
    constructor(injector: Injector) {
        super(injector);
    }

    public setModel(model: any): void {
        this.data = model.data;
        this.listData = model.resolvedData.listData;
    }

    public loadData(): Promise<void> {
        this.setResolvedListData();
        this.setResolvedMetaData();
        return Promise.resolve();
    }

    protected setupData(): void {
        //this.setBeneficiaryRoleId();
        if(this.data.RoleId!=null)
        {
            this.beneType = ListDataUtil.getIdFromListDataByExternalCode(
            this.listData.BeneficiaryType,
            this.data.RoleId.toString()
        );}
    }

    public onBeneficiaryTypeChange(): void {
        this.setBeneficiaryRoleId();
    }

    private setBeneficiaryRoleId(): void {
        this.data.RoleId = ListDataUtil.getExternalCodeFromListDataById(
            this.listData.BeneficiaryType,
            this.beneType)
    }
     
}
