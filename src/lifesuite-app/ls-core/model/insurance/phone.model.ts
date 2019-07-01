import { BaseModel } from '../core';

export class PhoneModel extends BaseModel {
    public readonly $type: string = 'vpi.aus.core.PhoneModel, LifeSuite';
    public PersonId: Object;
    public PhoneTypeCode: string;
    public CountryCallingCode: string;
    public AreaCode: string;
    public Prefix: string;
    public Suffix: string;
    public Extension: string;
    public Pin: string;
    public IsPreferred: Object;
}

export const PhoneTypes = {
    WORK: 'WORK',
    HOME: 'HOME',
    CELL: 'CELL',
    FAX: 'FAX',
    BUSINESS: 'BUSINESS'
};
