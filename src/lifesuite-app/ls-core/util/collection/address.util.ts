import { CollectionUtil, PredicateType } from 'life-core/util/collection';
import { AddressDTO, Identifiable } from 'ls-core/model';

export class AddressUtil {
    public static addAddressIfNotFound(addresses: AddressDTO[], addressType: string): AddressDTO | undefined {
        let address: AddressDTO;
        address = CollectionUtil.addItemIfNotFound<AddressDTO>(
            addresses,
            AddressDTO,
            createAddressPredicate(addressType)
        );
        if (address) {
            AddressUtil.initAddress(address, addressType);
        }
        return address;
    }

    public static addAddressIfCollectionEmpty(addresses: AddressDTO[], addressType: string): AddressDTO | undefined {
        let address: AddressDTO;
        address = CollectionUtil.addItemIfCollectionEmpty<AddressDTO>(addresses, AddressDTO);
        if (address) {
            AddressUtil.initAddress(address, addressType);
        }
        return address;
    }

    public static getAddress(addresses: AddressDTO[], addressType: string): AddressDTO | undefined {
        return addresses.find(createAddressPredicate(addressType));
    }

    public static getAddressIndex(addresses: AddressDTO[], addressType: string): number {
        return addresses.findIndex(createAddressPredicate(addressType));
    }

    public static addNewAddressByType(addresses: AddressDTO[], addressType: string): AddressDTO {
        const address = this.createAddress(addressType);
        addresses.push(address);
        return address;
    }

    public static createAddress(addressType: string): AddressDTO {
        const address = new AddressDTO();
        AddressUtil.initAddress(address, addressType);
        return address;
    }

    public static deleteAddress(addresses: AddressDTO[], addressType: string): AddressDTO {
        const index = AddressUtil.getAddressIndex(addresses, addressType);
        if (index >= 0) {
            return CollectionUtil.deleteItem<AddressDTO>(addresses, index);
        }
        return null;
    }

    public static initAddress(address: AddressDTO, addressType: string): AddressDTO {
        address.AddressTypeCode = addressType;
        address.AddressLine1 = '';
        address.AddressLine2 = '';
        address.AddressLine3 = '';
        address.City = '';
        address.CountryId = null;
        address.CountryStateId = null;
        address.PostalCode = '';
        return address;
    }

    public static cleanAddressButPreserveType(address: AddressDTO): AddressDTO {
        AddressUtil.initAddress(address, address.AddressTypeCode);
        address.identifier = new Identifiable();
        return address;
    }

    public static getFullAddress(address: AddressDTO, stateName: string, countryName: string): string {
        const addressLine1 = `${address.AddressLine1}` || '';
        const addressLine2 = `, ${address.AddressLine2}` || '';
        const state = address.CountryId ? `, ${stateName}` : '';
        const country = address.CountryId ? `, ${countryName}` : '';
        const postalCode = address.PostalCode ? `, ${address.PostalCode}` : '';
        const fullAddress = `${addressLine1}${addressLine2}, ${address.City}${state} ${country}${postalCode}`;
        return fullAddress;
    }
}

function createAddressPredicate(addressType: string): PredicateType<AddressDTO> {
    return address => {
        return address.AddressTypeCode == addressType;
    };
}
