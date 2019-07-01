import { BaseModel } from '../core/base.model';
import { DBDateCrypted } from '../util/dbdate-crypted';

export class PartyModel extends BaseModel {
    public readonly $type: string = 'vpi.aus.common.PartyModel, LifeSuite';

    public PersonId: Object;

    public PartyId: Object;

    public LastName: string;

    public FirstName: string;

    public MiddleName: string;

    public BirthName: string;

    public Title: string;

    public Suffix: string;

    public TaxId: string;

    public TaxTypeId: string;

    public BirthDate: DBDateCrypted;

    public Sex: string;

    public PersonTypeId: string;

    public PreferredLanguageCode: string;

    public EmailAddress: string;

    public MaritalStatus: string;

    public ClientId: string;

    public PreferredContactMode: string;

    public AltEmailAddress: string;

    public ClassType: string;

    public Field1: string;

    public Field2: string;

    public Field3: string;

    public Field4: string;

    public Field5: string;

    public FormOfId: string;

    public CitizenshipCountry: string;

    public Addresses: Array<any>;

    public Phones: Array<any>;

    public Relations: Array<any>;
}
