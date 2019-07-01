import { DTOObjectMember } from '../model/dto-object.model';

const DependenciesMap: { readonly [field: string]: string[] } = {
    ['life.ls.ui.ria.dto.AddressDTO']: ['CountryId'],
    ['life.ls.ui.ria.dto.ApplicationInfoDTO']: ['DriversLicenseCountryId', 'ResidenceCountry', 'BirthCountry'],
    ['life.ls.ui.ria.dto.BenefitDTO']: ['CoverageStatus', 'Note'],
    ['life.ls.ui.ria.dto.CoverageDTO']: ['PolicyPersonId', 'CoveragePersonId', 'Disposition', 'PlanCodeId', 'GNumber'],
    ['life.ls.ui.ria.dto.InsuredDTO']: ['SignedCountryId'],
    ['life.ls.ui.ria.dto.NoteDTO']: ['Visibility', 'UserType'],
    ['life.ls.ui.ria.dto.PolicyDTO']: ['Disposition', 'ReinsurerId', 'TeamId'],
    ['life.ls.ui.ria.dto.RequirementDTO']: [
        'InsuredRequirementId',
        'RequirementCode',
        'OrderedBy',
        'Provider',
        'ClosedDisposition'
    ],
    ['life.ls.ui.ria.dto.AmendmentDTO']: ['AmendmentType', 'CoveragePersonId'],
    ['life.ls.ui.ria.dto.MedicationDTO']: ['Condition', 'DrugName'],
    ['life.ls.ui.ria.dto.ReinsurerDTO']: ['ReinsurerId'],
    ['life.ls.ui.ria.dto.TPADTO']: ['TpaCode'],
    ['life.ls.ui.ria.dto.FundAllocationDTO']: ['FundCode'],
    ['life.ls.ui.ria.dto.AgencyDTO']: ['AgencyNumber'],
    ['life.ls.ui.ria.dto.MedicalConditionDTO']: ['BodilySystem', 'Condition', 'Criteria', 'TimeOfCriteria'],
    ['life.ls.ui.ria.dto.LSSystemDTO']: ['userId']
    // [ApplicantQuestionDTO.name]: ['AnswerSetName']
};

const NameValueExceptions = {
    PolicyDTO_ReinsurerId: 'ReinsuranceVendorCode',
    ReinsurerDTO_ReinsurerId: 'CompanyCode'
};

/**
 * This class tracks dependencies between list data and provides the necessary
 * information for the server to determine the correct dependent list data
 * to return. It is used by ListDataRequestBuilder and does not need
 * to be used directly by developers.
 */
export class DependentListHelper {
    public static getDependencies(dto: Object, className: string): DTOObjectMember[] {
        // Exceptions:
        // PolicyDTO: 'ReinsurerId', objPolicy.ReinsuranceVendorCode;
        // ReinsurerDTO: 'ReinsurerId', objReinsurer.CompanyCodeclassName
        const dependencyNames = DependenciesMap[className] || [];
        const dependencies: DTOObjectMember[] = dependencyNames.map(dependencyName => {
            const valuePropertyName = NameValueExceptions[`${className}_${dependencyName}`] || dependencyName;
            return new DTOObjectMember(dependencyName, dto[valuePropertyName]);
        });
        return dependencies;
    }
}
