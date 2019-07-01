import { PolicyByProductProxyDTO } from 'ls-core/model';

export interface SearchFormData {
    policy: PolicyByProductProxyDTO;
}

export class SearchFormDataBuilder {
    public static build(policy: PolicyByProductProxyDTO): SearchFormData {
        return {
            policy: policy
        };
    }
}
