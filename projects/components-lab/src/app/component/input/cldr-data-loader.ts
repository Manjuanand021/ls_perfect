import { load } from '@kendo/kendo-angular-intl';

export function loadCldrData() {
    load(
        require('cldr-data/supplemental/likelySubtags.json'),
        require('cldr-data/supplemental/currencyData.json'),
        require('cldr-data/supplemental/weekData.json'),

        require('cldr-data/main/fr/numbers.json'),
        require('cldr-data/main/fr/currencies.json'),
        require('cldr-data/main/fr/dateFields.json'),
        require('cldr-data/main/fr/ca-gregorian.json'),
        require('cldr-data/main/fr/timeZoneNames.json'),

        require('cldr-data/main/fr-ca/numbers.json'),
        require('cldr-data/main/fr-ca/currencies.json'),
        require('cldr-data/main/fr-ca/dateFields.json'),
        require('cldr-data/main/fr-ca/ca-gregorian.json'),
        require('cldr-data/main/fr-ca/timeZoneNames.json')
    );
}
