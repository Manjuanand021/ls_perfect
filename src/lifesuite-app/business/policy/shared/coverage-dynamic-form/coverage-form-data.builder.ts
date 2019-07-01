import { PolicyDTO, CoverageDTO } from 'ls-core/model';

export interface CoverageFormData {
	policy: PolicyDTO;
	coverage: CoverageDTO;
}

export class CoverageFormDataBuilder {

	static build(policy: PolicyDTO, coverage: CoverageDTO): CoverageFormData {
		return {
			policy: policy,
			coverage: coverage
		};
	}

}
