import { Identifiable } from './identifiable';
import { RelatedPolicyModel } from '../insurance/related-policy.model';

export class RelatedPolicyDTO extends RelatedPolicyModel {
    public static Type: string = 'life.ls.ui.ria.dto.RelatedPolicyDTO, LifeSuite.UIServiceDTO';
    public readonly $type: string = RelatedPolicyDTO.Type;

    public identifier: Identifiable;

    public getIdentifier(): Identifiable {
        return this.identifier;
    }
}
