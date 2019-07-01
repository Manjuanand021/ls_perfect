import { PolicyModel } from '../insurance/policy.model';
import { Identifiable } from './identifiable';
import {
    AgentDTO,
    AgencyDTO,
    InsuredDTO,
    NoteDTO,
    OwnerDTO,
    PayorDTO,
    PolicyCoverageDTO,
    RequirementDTO
} from './index';

export class PolicyDTO extends PolicyModel {
    public static Type: string = 'life.ls.ui.ria.dto.PolicyDTO, LifeSuite.UIServiceDTO';
    public readonly $type: string = PolicyDTO.Type;

    public identifier: Identifiable;

    public Disposition: string;

    public PolicyCoverages_LazyLoad: Array<PolicyCoverageDTO>;
    public Insureds_LazyLoad: Array<InsuredDTO>;
    public Agents_LazyLoad: Array<AgentDTO>;
    public Agencies_LazyLoad: Array<AgencyDTO>;
    public Payors_LazyLoad: Array<PayorDTO>;
    public Owners_LazyLoad: Array<OwnerDTO>;
    // public LogEntries_LazyLoad: Array<>;
    // public SystemSearches_LazyLoad: Array<>;
    // public PolicyAdminStatuses_LazyLoad: Array<>;
    // public AdminSystemMessages_LazyLoad: Array<>;
    public Requirements_LazyLoad: Array<RequirementDTO>;
    public Notes_LazyLoad: Array<NoteDTO>;

    public faceAmount: number;

    // public serviceAssociate:life.ls.ui.ria.dto.vo.UserDTO;

    public creditCardNumberDecrypted: string;

    public creditCardAccountNameDecrypted: string;

    public bankAccountNameDecrypted: string;

    public creditCardExpirationMonthDecrypted: string;

    public creditCardExpirationYearDecrypted: string;

    public bankRountingNumberDecrypted: string;

    public bankAccountNumberDecrypted: string;

    public bankTransactionNumberDecrypted: string;

    public getIdentifier(): Identifiable {
        return this.identifier;
    }
}
