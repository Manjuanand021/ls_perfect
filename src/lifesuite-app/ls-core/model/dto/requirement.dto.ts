import { Identifiable } from './identifiable';
import { RequirementModel } from '../insurance/requirement.model';
import { MedicalProviderProxyDTO, EvidenceStatusDTO, NoteDTO } from 'ls-core/model';

export class RequirementDTO extends RequirementModel {
    public readonly $type: string = 'life.ls.ui.ria.dto.RequirementDTO, LifeSuite.UIServiceDTO';
    public identifier: Identifiable;

    public EvidenceStatuses_LazyLoad: Array<EvidenceStatusDTO>;
    // public RequirementStatuses: Array<>;

    public supportsMatch: boolean = false;
    public requirementType: string;
    public Note: NoteDTO = null;

    // driver license information
    public DLNumber: string;
    public DLState: string;

    // Physician information
    public medicalProviderProxyDTO: MedicalProviderProxyDTO;

    // whether manual action counter has been increased. For use in UI only.
    public _counterIncreased: boolean = false;

    public getIdentifier(): Identifiable {
        return this.identifier;
    }
}
