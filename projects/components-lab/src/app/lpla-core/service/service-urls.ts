import { UrlUtil } from 'life-core/util';

/**
 * Defines global url constants: app root url,
 * authorization url, etc.
 */
export const ServiceUrls = {
    AppRootUrl: UrlUtil.prependUrl('LifePortraits.aspx'),
    AuthUrl: UrlUtil.prependUrl('login'),
    LogoutUrl: UrlUtil.prependUrl('logout'),
    ChangePasswordUrl: UrlUtil.prependUrl('changePassword')
};
