import { PolicyDTO, InsuredDTO } from 'ls-core/model';

export class ReviewMessageDataContext {
    public policy: PolicyDTO;
    public applicant: InsuredDTO;
}