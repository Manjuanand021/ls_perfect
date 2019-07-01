import { Injector, Injectable } from '@angular/core';
import { ObjectUtil } from 'life-core/util/lang';
import {
    AddressDTO,
    ApplicationInfoDTO,
    TPADTO,
    OwnerDTO,
    AssociationDTO,
    EmployerDTO,
    AgencyDTO,
    AgentDTO,
    PolicyDTO
} from 'ls-core/model';
import { ListDataRequestBuilder, ListsDataRequest } from 'ls-core/service';
import { AppSession } from 'ls-core/session/app-session';
import { BaseListDataResolver } from 'ls-core/view-model';
import { PrimaryInsuredHelper } from './../shared';

@Injectable()
export class CaseListDataResolver extends BaseListDataResolver {
    private _appSession: AppSession;

    constructor(injector: Injector, appSession: AppSession) {
        super(injector);
        this._appSession = appSession;
    }

    protected getListsDataRequest(): ListsDataRequest {
        const listDataRequestBuilder = new ListDataRequestBuilder();
        listDataRequestBuilder.setRootDTO(this.policy);

        this.addOwnerListRequestItems(listDataRequestBuilder);
        this.addPaymentInfoListRequestItems(listDataRequestBuilder);
        this.addDistributionListRequestItems(listDataRequestBuilder);
        this.addInformationListRequestItems(listDataRequestBuilder);
        this.addEmployerListRequestItems(listDataRequestBuilder);
        this.addAssociationListRequestItems(listDataRequestBuilder);
        this.addTpaListRequestItems(listDataRequestBuilder);
        this.addAgencyListRequestItems(listDataRequestBuilder);
        this.addAgentListRequestItems(listDataRequestBuilder);
        this.addPersonalInfoDataListRequestItems(listDataRequestBuilder);
        // Other sections
        //  ...

        return listDataRequestBuilder.getRequest();
    }

    private addOwnerListRequestItems(listDataRequestBuilder: ListDataRequestBuilder): void {
        let ownerDTO: OwnerDTO;
        if (this.policy.Owners_LazyLoad && this.policy.Owners_LazyLoad.length > 0) {
            ownerDTO = this.policy.Owners_LazyLoad[0];
        } else {
            ownerDTO = new OwnerDTO();
        }
        listDataRequestBuilder.addListRequestItem(ownerDTO, 'PersonTypeId');
        listDataRequestBuilder.addListRequestItem(ownerDTO, 'Title');
        listDataRequestBuilder.addListRequestItem(ownerDTO, 'Suffix');
        listDataRequestBuilder.addListRequestItem(ownerDTO, 'SubRoleId');
        listDataRequestBuilder.addListRequestItem(ownerDTO, 'RelationshipToInsured');

        let addressDTO: AddressDTO;
        if (ownerDTO.Addresses_LazyLoad && ownerDTO.Addresses_LazyLoad.length > 0) {
            addressDTO = ownerDTO.Addresses_LazyLoad[0] as AddressDTO;
        } else {
            addressDTO = new AddressDTO();
        }
        listDataRequestBuilder.addListRequestItem(addressDTO, 'CountryId');
    }

    private addPaymentInfoListRequestItems(listDataRequestBuilder: ListDataRequestBuilder): void {
        listDataRequestBuilder.addListRequestItem(this.policy, 'PaymentModeCode');
        listDataRequestBuilder.addListRequestItem(this.policy, 'CreditCardType');
        listDataRequestBuilder.addListRequestItem(this.policy, 'PaymentMethodCode');
        listDataRequestBuilder.addListRequestItem(this.policy, 'BankAccountType');
        listDataRequestBuilder.addListRequestItem(this.policy, 'TrustCode');
    }

    private addDistributionListRequestItems(listDataRequestBuilder: ListDataRequestBuilder): void {
        listDataRequestBuilder.addListRequestItem(this.policy, 'SourceInfo');
        listDataRequestBuilder.addListRequestItem(this.policy, 'DistributorCode');
    }

    private addInformationListRequestItems(listDataRequestBuilder: ListDataRequestBuilder): void {
        listDataRequestBuilder.addListRequestItem(this.policy, 'CompanyCode');
        listDataRequestBuilder.addListRequestItem(this.policy, 'PreferredLanguageCode');
        listDataRequestBuilder.addListRequestItem(this.policy, 'ApplicationType');
        listDataRequestBuilder.addListRequestItem(this.policy, 'Priority');
        listDataRequestBuilder.addListRequestItem(this.policy, 'UnderwriterId');
        listDataRequestBuilder.addListRequestItem(this.policy, 'ServiceAssociateId');
        listDataRequestBuilder.addListRequestItem(this.policy, 'TeamId');
    }

    private addAssociationListRequestItems(listDataRequestBuilder: ListDataRequestBuilder): void {
        const associationDTO = { CompanyCode: this.policy.AssociationCode };
        listDataRequestBuilder.addListRequestItem(
            ObjectUtil.createObjectOfType(associationDTO, AssociationDTO),
            'Association_CompanyCode'
        );
    }

    private addEmployerListRequestItems(listDataRequestBuilder: ListDataRequestBuilder): void {
        const employerDTO = { PersonId: this.policy.EmployerId };
        listDataRequestBuilder.addListRequestItem(
            ObjectUtil.createObjectOfType(employerDTO, EmployerDTO),
            'Employer_CompanyCode'
        );
    }

    private addTpaListRequestItems(listDataRequestBuilder: ListDataRequestBuilder): void {
        const tpaDTO = { TpaCode: this.policy.TpaCode };
        listDataRequestBuilder.addListRequestItem(ObjectUtil.createObjectOfType(tpaDTO, TPADTO), 'TpaCode');
    }

    private addAgencyListRequestItems(listDataRequestBuilder: ListDataRequestBuilder): void {
        let agency: AgencyDTO;
        if (this.policy.Agencies_LazyLoad && this.policy.Agencies_LazyLoad.length > 0) {
            agency = this.policy.Agencies_LazyLoad[0] as AgencyDTO;
        } else {
            agency = new AgencyDTO();
        }
        const agencyDTO = { AgencyNumber: agency.AgencyNumber };
        listDataRequestBuilder.addListRequestItem(ObjectUtil.createObjectOfType(agencyDTO, AgencyDTO), 'PersonId');
    }

    private addAgentListRequestItems(listDataRequestBuilder: ListDataRequestBuilder): void {
        let agentDTO: AgentDTO;
        if (this.policy.Agents_LazyLoad && this.policy.Agents_LazyLoad.length > 0) {
            agentDTO = this.policy.Agents_LazyLoad[0];
        } else {
            agentDTO = new AgentDTO();
        }
        listDataRequestBuilder.addListRequestItem(agentDTO, 'AgentNumber');
        listDataRequestBuilder.addListRequestItem(agentDTO, 'Title');
        listDataRequestBuilder.addListRequestItem(agentDTO, 'Suffix');
        listDataRequestBuilder.addListRequestItem(agentDTO, 'ProducerType');

        let addressDTO: AddressDTO;
        if (agentDTO.Addresses_LazyLoad && agentDTO.Addresses_LazyLoad.length > 0) {
            addressDTO = agentDTO.Addresses_LazyLoad[0] as AddressDTO;
        } else {
            addressDTO = new AddressDTO();
        }
        listDataRequestBuilder.addListRequestItem(addressDTO, 'CountryId');
        listDataRequestBuilder.addListRequestItem(addressDTO, 'CountryStateId');
    }

    // Personal Information
    private addPersonalInfoDataListRequestItems(listDataRequestBuilder: ListDataRequestBuilder): void {
        const primaryInsured = PrimaryInsuredHelper.getPrimaryInsured(this.policy);
        let applicantInfoDTO: ApplicationInfoDTO;
        if (primaryInsured.Applications_LazyLoad && primaryInsured.Applications_LazyLoad.length > 0) {
            applicantInfoDTO = primaryInsured.Applications_LazyLoad[0] as ApplicationInfoDTO;
        } else {
            applicantInfoDTO = new ApplicationInfoDTO();
        }
        listDataRequestBuilder.addListRequestItem(applicantInfoDTO, 'CitizenshipCountryId');
    }

    private get policy(): PolicyDTO {
        return this._appSession.policyDTO;
    }
}
