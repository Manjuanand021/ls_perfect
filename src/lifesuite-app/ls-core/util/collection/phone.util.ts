import { CollectionUtil, PredicateType } from 'life-core/util/collection';
import { PhoneDTO, Identifiable } from 'ls-core/model';

export class PhoneUtil {
    public static addPhoneIfNotFound(phones: PhoneDTO[], phoneType: string): PhoneDTO | undefined {
        let phone: PhoneDTO;
        phone = CollectionUtil.addItemIfNotFound<PhoneDTO>(phones, PhoneDTO, createPhonePredicate(phoneType));
        if (phone) {
            PhoneUtil.initPhone(phone, phoneType);
        }
        return phone;
    }

    public static addPhoneIfCollectionEmpty(phones: PhoneDTO[], phoneType: string): PhoneDTO | undefined {
        let phone: PhoneDTO;
        phone = CollectionUtil.addItemIfCollectionEmpty<PhoneDTO>(phones, PhoneDTO);
        if (phone) {
            PhoneUtil.initPhone(phone, phoneType);
        }
        return phone;
    }

    public static getPhone(phones: PhoneDTO[], phoneType: string): PhoneDTO | undefined {
        return phones.find(createPhonePredicate(phoneType));
    }

    public static getPhoneIndex(phones: PhoneDTO[], phoneType: string): number {
        return phones.findIndex(createPhonePredicate(phoneType));
    }

    public static addNewPhoneByType(phones: PhoneDTO[], phoneType: string): PhoneDTO {
        const phone = this.createPhone(phoneType);
        phones.push(phone);
        return phone;
    }

    public static deletePhone(phones: PhoneDTO[], phoneType: string): PhoneDTO {
        const index = PhoneUtil.getPhoneIndex(phones, phoneType);
        if (index >= 0) {
            return CollectionUtil.deleteItem<PhoneDTO>(phones, index);
        }
        return null;
    }

    public static convertPhoneStringToObject(value: string, phoneType: string): PhoneDTO {
        const phone = this.createPhone(phoneType);
        const AreaCodeLength = 3;
        const PrefixLength = 3;
        const SuffixLength = 4;
        const TotalLength = AreaCodeLength + PrefixLength + SuffixLength;
        if (value.length >= TotalLength) {
            phone.AreaCode = value.substring(0, AreaCodeLength);
            phone.Prefix = value.substring(AreaCodeLength, AreaCodeLength + PrefixLength);
            phone.Suffix = value.substring(AreaCodeLength + PrefixLength, TotalLength);
            phone.Extension = value.substring(TotalLength, value.length);
        }
        return phone;
    }

    public static getPhoneString(phone: PhoneDTO): string {
        return phone.Extension
            ? `(${phone.AreaCode})${phone.Prefix}-${phone.Suffix} Ext ${phone.Extension}`
            : `(${phone.AreaCode})${phone.Prefix}-${phone.Suffix}`;
    }

    public static createPhone(phoneType: string): PhoneDTO {
        const phone = new PhoneDTO();
        PhoneUtil.initPhone(phone, phoneType);
        return phone;
    }
    public static initPhone(phone: PhoneDTO, phoneType: string): PhoneDTO {
        phone.PhoneTypeCode = phoneType;
        phone.AreaCode = '';
        phone.CountryCallingCode = '';
        phone.Prefix = '';
        phone.Suffix = '';
        phone.Suffix = '';
        phone.Extension = '';
        return phone;
    }

    public static cleanPhoneButPreserveType(phone: PhoneDTO): PhoneDTO {
        PhoneUtil.initPhone(phone, phone.PhoneTypeCode);
        phone.identifier = new Identifiable();
        return phone;
    }
}

function createPhonePredicate(phoneType: string): PredicateType<PhoneDTO> {
    return phone => {
        return phone.PhoneTypeCode == phoneType;
    };
}
