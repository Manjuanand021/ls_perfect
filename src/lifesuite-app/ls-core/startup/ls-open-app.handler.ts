import { BaseOpenAppHandler, StartupContextUtil } from 'life-core/startup';
import { Locale } from 'life-core/i18n';
import { AppSession } from 'ls-core/session';
import { environment, EnvironmentTypes } from 'environments';

export abstract class LsOpenAppHandler extends BaseOpenAppHandler {
    private _appSession: AppSession;

    constructor(startupContextUtil: StartupContextUtil, appSession: AppSession) {
        super(startupContextUtil);
        this._appSession = appSession;
    }

    protected get userId(): string {
        return this._appSession.user.LoginId;
    }

    /**
     *  Return locale to use as part of application url,
     *  in multi-app deployments (with separate app for each language).
     *  For Production mode, return locale based on user language;
     *  For Development mode, always return default locale (en_us),
     *  because only one app served in development mode.
     *
     *  Note: this will become obsolete once run-time i18n is available.
     */
    protected get urlLocale(): string {
        // In development mode, there is only one language folder defined - en_us;
        // In production mode
        return environment.type == EnvironmentTypes.PROD
            ? this._appSession.user.PreferredLanguageCode
            : Locale.en_US.toLowerCase();
    }
}
