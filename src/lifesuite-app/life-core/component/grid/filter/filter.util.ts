import { LangUtil } from 'life-core/util/lang';
import { GridFilteringType } from './model/grid-filter.model';

export class FilterUtil {
    public static passFilter<T>(filteringType: string, value: T, filterValue: T, filterToValue?: T): boolean {
        if (filteringType == GridFilteringType.Equals) {
            if (LangUtil.isDate(value)) {
                // Get time before doing Date object comparison
                return (<any>value).getTime() == (<any>filterValue).getTime();
            }
            return value == filterValue;
        }
        if (filteringType == GridFilteringType.GreaterThanOrEqual) {
            return value >= filterValue;
        }
        if (filteringType == GridFilteringType.LessThanOrEqual) {
            return value <= filterValue;
        }
        if (filteringType == GridFilteringType.InRange) {
            return value >= filterValue && value <= filterToValue;
        }
    }
}
