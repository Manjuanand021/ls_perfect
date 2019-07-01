import { Identifiable } from './identifiable';
import { PolicyProxy } from '../insurance/policy-proxy';

export class PolicyProxyDTO extends PolicyProxy {
    public static Type: string = 'life.ls.ui.ria.dto.PolicyProxyDTO, LifeSuite.UIServiceDTO';

    public readonly $type: string = PolicyProxyDTO.Type;

    public LineOfBusinessCode: string;

    public identifier: Identifiable;

    public getIdentifier(): Identifiable {
        return this.identifier;
    }
}
