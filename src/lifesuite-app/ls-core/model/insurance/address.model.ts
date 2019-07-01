import { BaseModel } from '../core';

export class AddressModel extends BaseModel {
    public readonly $type: string = 'vpi.aus.core.AddressModel, LifeSuite';
    public PersonId: Object;
    public AddressTypeCode: string;
    public City: string;
    public CountryId: string;
    public PostalCode: string;
    public CountryStateId: string;
    public AddressLine1: string;
    public AddressLine2: string;
    public AddressLine3: string;
    public MailingAddressFlag: Object;
}
