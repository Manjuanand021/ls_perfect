import { PolicyDTO, InsuredDTO, RelationTypes, Identifiable, AddressDTO, PhoneDTO } from 'ls-core/model';
import { ObjectUtil } from 'life-core/util/lang/object.util';
import { PhoneUtil, AddressUtil } from 'ls-core/util';

export class PrimaryInsuredHelper {
    public static getPrimaryInsured(policy: PolicyDTO): InsuredDTO {
        if (!policy.Insureds_LazyLoad || policy.Insureds_LazyLoad.length == 0) {
            return null;
        }
        let primaryInsured = policy.Insureds_LazyLoad.find(insured => {
            return insured.PrimaryInsuredFlag !== 0;
        });
        if (!primaryInsured) {
            primaryInsured = policy.Insureds_LazyLoad[0];
        }
        return primaryInsured;
    }

    public static copyDataFromPrimaryInsuredToNewData(primaryInsured: InsuredDTO, targetData: any): void {
        targetData.identifier = new Identifiable();
        targetData.PersonTypeId = primaryInsured.PersonTypeId;
        targetData.PersonId = primaryInsured.PersonId;
        targetData.TaxId = primaryInsured.TaxId;
        targetData.ClientId = primaryInsured.ClientId;
        targetData.BirthDate = primaryInsured.BirthDate;
        targetData.Title = primaryInsured.Title;
        targetData.LastName = primaryInsured.LastName;
        targetData.FirstName = primaryInsured.FirstName;
        targetData.MiddleName = primaryInsured.MiddleName;
        targetData.Suffix = primaryInsured.Suffix;
        targetData.isPrimaryInsured = true;
        targetData.RelationshipToInsured = RelationTypes.INSURED;

        targetData.Addresses_LazyLoad = [];
        if (primaryInsured.Addresses_LazyLoad && primaryInsured.Addresses_LazyLoad.length > 0) {
            primaryInsured.Addresses_LazyLoad.forEach(address => {
                const targetAddress = ObjectUtil.createObjectOfType(address, AddressDTO) as AddressDTO;
                targetData.Addresses_LazyLoad.push(targetAddress);
            });
        }
        targetData.Phones_LazyLoad = [];
        if (primaryInsured.Phones_LazyLoad && primaryInsured.Phones_LazyLoad.length > 0) {
            primaryInsured.Phones_LazyLoad.forEach(phone => {
                const targetPhone = ObjectUtil.createObjectOfType(phone, PhoneDTO) as PhoneDTO;
                targetData.Phones_LazyLoad.push(targetPhone);
            });
        }
    }

    public static removePrimaryInsuredDataFromItem(targetData: any): void {
        targetData.identifier = new Identifiable();
        targetData.PersonId = null;
        targetData.TaxId = '';
        targetData.ClientId = null;
        targetData.BirthDate = null;
        targetData.Title = '';
        targetData.EmailAddress = '';
        targetData.LastName = '';
        targetData.FirstName = '';
        targetData.MiddleName = '';
        targetData.Suffix = '';
        targetData.SubRoleId = '';
        targetData.isPrimaryInsured = false;
        targetData.RelationshipToInsured = '';

        if (targetData.Addresses_LazyLoad && targetData.Addresses_LazyLoad.length > 0) {
            const addressTypes = targetData.Addresses_LazyLoad.map(address => address.AddressTypeCode);
            targetData.Addresses_LazyLoad = [];
            addressTypes.forEach(addressType => {
                AddressUtil.addNewAddressByType(targetData.Addresses_LazyLoad, addressType);
            });
        }
        if (targetData.Phones_LazyLoad && targetData.Phones_LazyLoad.length > 0) {
            const phoneTypes = targetData.Phones_LazyLoad.map(phone => phone.PhoneTypeCode);
            targetData.Phones_LazyLoad = [];
            phoneTypes.forEach(phoneType => {
                PhoneUtil.addNewPhoneByType(targetData.Phones_LazyLoad, phoneType);
            });
        }
    }

    public static resetOwnerPayorDataUponOwnerPayorTypeChange(targetData: any): void {
        targetData.TaxId = '';
        targetData.ClientId = null;
        targetData.BirthDate = null;
        targetData.Title = '';
        targetData.LastName = '';
        targetData.FirstName = '';
        targetData.MiddleName = '';
        targetData.Suffix = '';
        targetData.RelationshipToInsured = '';
    }
}
