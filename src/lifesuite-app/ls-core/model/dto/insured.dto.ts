import { Identifiable } from './identifiable';
import { InsuredModel } from '../insurance/insured.model';
import {
    AddressDTO,
    ApplicationInfoDTO,
    CoverageDTO,
    LabDTO,
    MedicalConditionDTO,
    MedicationDTO,
    MIBCodeDTO,
    MIBDTO,
    MIBCodingDTO,
    NoteDTO,
    PartyRelationDTO,
    PhoneDTO,
    RelatedPolicyDTO,
    RequirementDTO,
    ReviewMessageDTO,
    MVRDTO,
    ParamedicalDTO,
    ApplicantQuestionDTO,
    VelogicaDTO
} from './index';

export class InsuredDTO extends InsuredModel {
    public readonly $type: string = 'life.ls.ui.ria.dto.InsuredDTO, LifeSuite.UIServiceDTO';

    public identifier: Identifiable;

    public preferredPhoneTypeCode: string;

    public getUnderwritingAmount: number;

    public Addresses_LazyLoad: Array<AddressDTO>;
    public Phones_LazyLoad: Array<PhoneDTO>;
    public Relations_LazyLoad: Array<PartyRelationDTO>;
    public ReviewMessages_LazyLoad: Array<ReviewMessageDTO>;
    public Requirements_LazyLoad: Array<RequirementDTO>;
    public Coverages_LazyLoad: Array<CoverageDTO>;
    public Labs_LazyLoad: Array<LabDTO>;
    public MVRs_LazyLoad: Array<MVRDTO>;
    public MIBs_LazyLoad: Array<MIBDTO>;
    public MibCodings_LazyLoad: Array<MIBCodingDTO>;
    public Applications_LazyLoad: Array<ApplicationInfoDTO>;
    public Parameds_LazyLoad: Array<ParamedicalDTO>;
    public Notes_LazyLoad: Array<NoteDTO>;
    public RelatedPolicies_LazyLoad: Array<RelatedPolicyDTO>;
    // public RetroInfos_LazyLoad: Array<>;
    public MedicalConditions_LazyLoad: Array<MedicalConditionDTO>;
    public Medication_LazyLoad: Array<MedicationDTO>;
    // public PrescriptionDrugs_LazyLoad: Array<>;
    // public TeleApps_LazyLoad: Array<>;
    public Velogicas_LazyLoad: Array<VelogicaDTO>;

    public isOpen: Boolean;

    public isHold: Boolean;

    public getTableRatingPoints: number;

    public AllowAutoAprovalString: string;

    public ApplicantQuestions: Array<ApplicantQuestionDTO>;

    // public MedicalConditions_LazyLoad: Array<MedicalConditionDTO>;

    public getIdentifier(): Identifiable {
        return this.identifier;
    }
    public isPrimary(): boolean {
        return this.PrimaryInsuredFlag !== 0;
    }
}
