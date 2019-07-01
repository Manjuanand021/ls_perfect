import { Identifiable } from './identifiable';
import { LabModel } from '../insurance/lab.model';
import { LabCommentDTO } from './lab-comment.dto';
import { LabResultDTO } from './lab-result.dto';
import { CustomerLabReportProxyModel } from '../insurance';

export class LabDTO extends LabModel {
    public static Type: string = 'life.ls.ui.ria.dto.LabDTO, LifeSuite.UIServiceDTO';
    public readonly $type: string = LabDTO.Type;

    public identifier: Identifiable;

    public Results_LazyLoad: Array<LabResultDTO>;
    public Comments_LazyLoad: Array<LabCommentDTO>;

    public CustomerLabReportProxies: Array<CustomerLabReportProxyModel>;

    public getIdentifier(): Identifiable {
        return this.identifier;
    }
}
