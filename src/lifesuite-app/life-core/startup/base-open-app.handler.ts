import { IActionHandler } from 'life-core/handler';
import { UrlUtil } from 'life-core/util';
import { StartupContext, StartupContextStorageKey } from './startup-context.model';
import { StartupContextUtil } from './startup-context.util';
import { OpenAppParams } from './open-app.model';

export abstract class BaseOpenAppHandler implements IActionHandler {
    private _startupContextUtil: StartupContextUtil;

    constructor(startupContextUtil: StartupContextUtil) {
        this._startupContextUtil = startupContextUtil;
    }

    public execute(params?: OpenAppParams): void {
        const startupContext = params.context || ({} as StartupContext);
        startupContext.userId = this.userId;
        this._startupContextUtil.setItem(StartupContextStorageKey, startupContext);
        const url = UrlUtil.prependUrl(this.getRoute(params));
        if (params.newInstance) {
            const windowoption = this.getOpenWindowOption();
            window.open(url, '', windowoption);
        } else {
            window.location.replace(url);
        }
    }

    protected abstract get userId(): string;

    protected abstract get urlLocale(): string;

    protected abstract getRoute(params: OpenAppParams): string;

    protected getOpenWindowOption(): string {
        return '';
    }
}
