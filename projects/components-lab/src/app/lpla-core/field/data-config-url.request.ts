
export class DataConfigUrlRequest {

    static Type: string = 'life.businessService.baseBusinessDataModel.DataConfigUrlRequest, BaseBusinessDataModel';
    $type: string = DataConfigUrlRequest.Type;

    public dataConfigUrl: string;
    public dataTemplateXml: string;
    public bypassFieldDescriptorLoad: boolean;
    public payLoad: Object;

    constructor() {
        this.dataConfigUrl = "";
        this.bypassFieldDescriptorLoad = false;
        this.dataTemplateXml = "";
        this.payLoad = null;
    }
}
