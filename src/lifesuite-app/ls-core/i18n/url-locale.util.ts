import { Locale } from 'life-core/i18n';
import { UserDTO } from 'ls-core/model';

export class UrlLocaleUtil {
    /*
     * Returns user localeId based on user's preferred language code.
     *
     **/
    public static getUrlLocale(user: UserDTO): string {
        return user.PreferredLanguageCode || Locale.en_US.toLowerCase();
    }
}
