import { StartupContext } from './startup-context.model';

export interface OpenAppParams {
    context?: StartupContext;
    newInstance: boolean;
}
