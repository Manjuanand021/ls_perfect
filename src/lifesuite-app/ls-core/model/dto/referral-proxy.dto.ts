import { Identifiable } from './identifiable';
import { ReferralProxyModel } from '../insurance';

export class ReferralProxyDTO extends ReferralProxyModel {
    public readonly $type: string = 'life.ls.ui.ria.dto.ReferralProxyDTO, LifeSuite.UIServiceDTO';

    public identifier: Identifiable;

    // public RateClassDesc: string;
    public getIdentifier(): Identifiable {
        return this.identifier;
    }
}
