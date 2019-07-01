export const CountryCodes = {
    USA: 'country_state_usa',
    CANADA: 'country_state_canada'
};

export const CountryFilterList: string[] = ['CANADA', 'USA'];

export function filterCountryListPredicate(country: any): boolean {
    return CountryFilterList.indexOf(country.Id) != -1;
}
