import { Identifiable } from './identifiable';
import { PhoneDTO, AddressDTO } from 'ls-core/model';

export class MedicalProviderProxyDTO {
    public readonly $type: string = 'life.ls.ui.ria.dto.MedicalProviderProxyDTO, LifeSuite.UIServiceDTO';
    public identifier: Identifiable;

    public ClientID: string;

    public FirstName: string;

    public LastName: string;

    public GovtID: string;

    public AddressLine1: string;

    public AddressLine2: string;

    public AddressCity: string;

    public AddressState: string;

    public Zip: string;

    public Fax: string;

    public Phone: string;

    public Ext: string;

    public Company: string;

    public Tittle: string;

    public CountryID: string;

    public PatientID: string;

    public PhoneDTO: PhoneDTO;

    public Addresses_LazyLoad: Array<AddressDTO>;

    public Phones_LazyLoad: Array<PhoneDTO>;

    public MedicalProviderSelected: Boolean;

    public MiddleName: string;

    public PhysicianID: string;

    public getIdentifier(): Identifiable {
        return this.identifier;
    }
}
