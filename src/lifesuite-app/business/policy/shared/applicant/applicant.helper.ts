import { InsuredDTO } from 'ls-core/model';
import { NameUtil } from 'life-core/util';

export class ApplicantHelper {
    public static getApplicantByPolicyPersonId(applicants: InsuredDTO[], policyPersonId: number): InsuredDTO {
        return applicants.find(applicant => {
            return applicant.PolicyPersonId == policyPersonId;
        });
    }

    public static getApplicantFullName(applicant: InsuredDTO): string {
        return applicant
            ? NameUtil.getFullNameWithMiddleInitial({
                  firstName: applicant.FirstName,
                  middleName: applicant.MiddleName,
                  lastName: applicant.LastName
              })
            : '';
    }
}
