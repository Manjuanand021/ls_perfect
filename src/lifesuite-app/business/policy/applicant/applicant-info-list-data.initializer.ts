import {
    AddressDTO,
    AddressTypes,
    PhoneTypes,
    ApplicationInfoDTO,
    TobaccoUseDTO,
    InsuredDTO,
    RelatedPolicyDTO,
    ReviewMessageDTO,
    CoverageDTO,
    NoteDTO,
    MedicalConditionDTO,
    MedicationDTO,
    FamilyHistoryDTO,
    WorksheetRowDTO,
    ImpairmentRestrictionDTO,
    AmendmentDTO,
    ReinsurerDTO
} from 'ls-core/model';
import { CollectionUtil } from 'life-core/util';
import { AddressUtil, PhoneUtil } from 'ls-core/util';

export class ApplicantInfoListDataInitializer {
    private _applicant: InsuredDTO;

    constructor(applicant: InsuredDTO) {
        this._applicant = applicant;
    }

    public initializeData(): void {
        // Follow these rules to decide when to add first element to lazyload collections on Applicant page
        // if collection is empty after lazyload:
        //
        // ADD items to collections requiring at least one item for the screen to show correctly.
        // DO NOT add items to collections which can have 0 elements in them, such as Other Insured and Physician -
        // by default they can be empty.
        AddressUtil.addAddressIfCollectionEmpty(this._applicant.Addresses_LazyLoad, AddressTypes.RESIDENCE);

        PhoneUtil.addPhoneIfNotFound(this._applicant.Phones_LazyLoad, PhoneTypes.HOME);
        PhoneUtil.addPhoneIfNotFound(this._applicant.Phones_LazyLoad, PhoneTypes.WORK);
        PhoneUtil.addPhoneIfNotFound(this._applicant.Phones_LazyLoad, PhoneTypes.CELL);

        CollectionUtil.addItemIfCollectionEmpty<ApplicationInfoDTO>(
            this._applicant.Applications_LazyLoad,
            ApplicationInfoDTO
        );
        CollectionUtil.addItemIfCollectionEmpty<TobaccoUseDTO>(
            this._applicant.Applications_LazyLoad[0].TobaccoUses_LazyLoad,
            TobaccoUseDTO
        );

        this._applicant.Relations_LazyLoad.forEach(relation => {
            AddressUtil.addAddressIfCollectionEmpty(relation.Addresses_LazyLoad, AddressTypes.BUSINESS);
            AddressUtil.addAddressIfNotFound(relation.Addresses_LazyLoad, AddressTypes.BUSINESS);
            PhoneUtil.addPhoneIfNotFound(relation.Phones_LazyLoad, PhoneTypes.BUSINESS);
        });
    }
}
