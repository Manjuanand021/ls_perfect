import {FieldDescriptorBase} from '../field-descriptor.model';

export class DependantFieldDescriptorRequest {

    static Type: string = 'life.businessService.businessDataModel.request.DependantFieldDescriptorRequest, BusinessDataModel';

    $type: string = DependantFieldDescriptorRequest.Type;
    fields: FieldDescriptorBase[];

    constructor(fields: FieldDescriptorBase[]) {
        this.fields = fields;
	}
}
