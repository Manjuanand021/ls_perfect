import { ScratchPadDTO } from 'ls-core/model';

export class ScratchPadRequest {
    public readonly $type: string = 'life.ls.ui.ria.dto.requests.ScratchPadRequest, LifeSuite.UIServiceDTO';
    public policyId: number;
    public scratchPadDTO: ScratchPadDTO;
}
