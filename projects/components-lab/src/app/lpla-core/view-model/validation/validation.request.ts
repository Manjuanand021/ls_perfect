
export class ValidationRequest {

    static Type: string = 'life.businessService.businessDataModel.request.ValidationRequest, BusinessDataModel';

    $type: string = ValidationRequest.Type;
	data: any;

    constructor(data: any) {
        this.data = data;
	}
}
