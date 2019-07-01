import { LfRadioButtonValuesType } from 'life-core/component/input';

export type LsRadioButtonValuesType = LfRadioButtonValuesType & {
    ALL_STRING: string;
    EXCLUDE_STRING: string;
    YES_LS_BOOLEAN: number;
    NO_LS_BOOLEAN: number;
};

export const LsRadioButtonValues: LsRadioButtonValuesType = {
    UNDEFINED_NUMBER: 0,
    YES_NUMBER: 1,
    NO_NUMBER: 2,
    YES_STRING: 'Yes',
    NO_STRING: 'No',
    YES_LETTER: 'Y',
    NO_LETTER: 'N',
    ALL_STRING: 'All',
    EXCLUDE_STRING: 'Exclude',
    YES_BOOLEAN: true,
    NO_BOOLEAN: false,
    YES_LS_BOOLEAN: -1,
    NO_LS_BOOLEAN: 0
};
