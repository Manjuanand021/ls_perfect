import { InsuredDTO, CoverageDTO } from 'ls-core/model';

export class PrimaryCoverageUtil {
    public static getPrimaryCoverage(insured: InsuredDTO): CoverageDTO {
        return insured && insured.Coverages_LazyLoad && insured.Coverages_LazyLoad.length
            ? insured.Coverages_LazyLoad[0]
            : null;
    }
}
