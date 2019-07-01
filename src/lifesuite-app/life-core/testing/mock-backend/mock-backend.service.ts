import { HttpRequest } from '@angular/common/http';

import { MockResponseResolver } from './mock-response-resolver';

export abstract class MockBackendService<TRequest, TResponse, TServiceParams> {
    private _mockResponseResolver: MockResponseResolver<TRequest, TServiceParams>;

    constructor() {
        this._mockResponseResolver = this.createMockResponseResolver();
    }

    public execute(request: HttpRequest<any>): TResponse {
        if (this.isApplicationRequest(request)) {
            const mockResponsePayload = this.getMockResponsePayload(request);
            return this.getMockResponse(mockResponsePayload);
        } else {
            throw new Error('MockBackendService: Wrong request type.');
        }
    }

    protected abstract isApplicationRequest(request: HttpRequest<any>): boolean;

    protected abstract createMockResponseResolver(): MockResponseResolver<TRequest, TServiceParams>;

    protected abstract getMockResponse(responsePayload: any): TResponse;

    private getMockResponsePayload(request: HttpRequest<any>): string {
        const dataRequest = this.getDataRequest(request);
        return this._mockResponseResolver.get(dataRequest);
    }

    private getDataRequest(request: HttpRequest<any>): TRequest {
        const requestBody: string = request.body;
        return <TRequest>JSON.parse(requestBody);
    }
}
