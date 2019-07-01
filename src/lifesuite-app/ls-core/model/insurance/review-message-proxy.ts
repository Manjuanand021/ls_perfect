import { BaseDTO } from '../dto/base.dto';

export class ReviewMessageProxy extends BaseDTO {
    public readonly $type: string = 'vpi.aus.insurance.core.ReviewMessageProxy, LifeSuite';

    public ApplicantName: string;

    public CaseManagerName: string;

    public CaseManagerLastName: string;

    public CaseManagerFirstName: string;

    public db_Name: string;

    public PolicyId: Object;

    public PolicyNumber: string;

    public TeamId: Object;

    public ApplicantFirstName: string;

    public ApplicantLastName: string;

    public MessageType: string;

    public OriginCode: string;

    public ReviewMessageText: string;

    public ServiceAssociateId: Object;

    public ServiceAssociateLoginId: string;

    public UserRoleType: string;
}
