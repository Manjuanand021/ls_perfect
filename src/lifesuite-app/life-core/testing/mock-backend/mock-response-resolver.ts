import { MockResponseRegistration } from './mock-response-registration';

export const MAP_KEY_DELIMITER = ':';

export abstract class MockResponseResolver<TRequest, TServiceParams> {
    protected mockedServiceMethodResponseMap: { [requestKey: string]: string } = {};

    constructor() {
        const mockResponseRegistration = this.createMockResponseRegistration();
        mockResponseRegistration.registrationMap.forEach(map => {
            this.add(map.dataServiceParams, map.mockResponse);
        });
    }

    private add(dataParams: TServiceParams, value: any): void {
        const request = this.createRequest(dataParams);
        const requestKey: string = this.getKey(request);
        this.mockedServiceMethodResponseMap[requestKey] = value;
    }

    public get(request: TRequest): any {
        const requestKey: string = this.getKey(request);
        console.assert(
            this.mockedServiceMethodResponseMap[requestKey] !== undefined,
            'Undefined mock service for request',
            request
        );
        return this.mockedServiceMethodResponseMap[requestKey];
    }

    protected abstract createMockResponseRegistration(): MockResponseRegistration<TServiceParams>;

    protected abstract createRequest(dataParams: TServiceParams): TRequest;

    protected abstract getKey(request: TRequest): string;
}
