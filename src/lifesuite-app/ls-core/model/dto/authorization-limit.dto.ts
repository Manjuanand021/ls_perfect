import { Identifiable } from './identifiable';
import { AuthorizationLimitModel } from 'ls-core/model/insurance/authorization-limit.model';

export class AuthorizationLimitDTO extends AuthorizationLimitModel {
    public readonly $type: string = 'life.ls.ui.ria.dto.AuthorizationLimitDTO, LifeSuite.UIServiceDTO';
    public getIdentifier(): Identifiable {
        return this.identifier;
    }
}
