export abstract class MockResponseRegistration<TServiceParams> {
    private _mockedResponseMap: Array<DataServiceParamsAndReponse<TServiceParams>> = [];

    constructor() {
        this.setupRegistration();
    }

    protected abstract setupRegistration(): void;

    protected addToRegistrationMap(dataServiceParams: TServiceParams, mockResponse: Object): void {
        this._mockedResponseMap.push(new DataServiceParamsAndReponse<TServiceParams>(dataServiceParams, mockResponse));
    }

    public get registrationMap(): Array<DataServiceParamsAndReponse<TServiceParams>> {
        return this._mockedResponseMap;
    }
}

export class DataServiceParamsAndReponse<TServiceParams> {
    public dataServiceParams: TServiceParams;

    public mockResponse: Object;

    constructor(dataServiceParams: TServiceParams, mockResponse: Object) {
        this.dataServiceParams = dataServiceParams;
        this.mockResponse = mockResponse;
    }
}
