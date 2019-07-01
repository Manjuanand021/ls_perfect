import { PolicyDTO, InsuredDTO } from 'ls-core/model';

export class PersonIdToPolicyPersonIdMapper {
    public static getPolicyPersonIdFromPersonId(persionId: number, policy: PolicyDTO): any {
        const insured: InsuredDTO = policy.Insureds_LazyLoad.find(insured => insured.PersonId == persionId);
        if (insured) {
            return insured.PolicyPersonId;
        }
        return null;
    }

    public static getPersonIdFromPolicyPersonId(policyPersonId: number, policy: PolicyDTO): any {
        const insured: InsuredDTO = policy.Insureds_LazyLoad.find(insured => insured.PolicyPersonId == policyPersonId);
        if (insured) {
            return insured.PersonId;
        }
        return null;
    }

    public static getInsuredByPolicyPersonId(id: string, insureds: Array<any>): InsuredDTO {
        const initialInsured: InsuredDTO = insureds.find(insured => insured.PolicyPersonId == id);
        if (initialInsured) return initialInsured;
        return null;
    }
}
