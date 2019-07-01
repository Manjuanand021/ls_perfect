import { BaseDTO, DBDate } from 'ls-core/model';

export class LogEntryProxyDTO extends BaseDTO {
    public static Type: string = 'life.ls.ui.ria.dto.LogEntryProxyDTO, LifeSuite.UIServiceDTO';

    public readonly $type: string = LogEntryProxyDTO.Type;

    public PolicyLogId: Object;

    public PolicyId: Object;

    public LogText: string;

    public UserId: Object;

    public UserLogin: string;

    public UserName: string;

    public LogDate: DBDate;

    public LogReasonType: Object;

    public LogReasonCode: string;

    public ApplicantId: Object;
}