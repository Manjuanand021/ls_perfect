
/**
* Defines generic user interface for authentication.
*/
export interface ILoginRequest {
    userName: string;
    password: string;
    sessionId: string;
    bypassSession: boolean;
    //locale: string;
    //isAuthenticated: boolean;
    //status: string;
}

/**
* Generic user interface implementation for authentication.
*/
export class LoginRequest implements ILoginRequest {

    static Type: string = 'life.businessService.businessDataModel.request.LoginRequest, BusinessDataModel';
    $type: string = LoginRequest.Type;

    userName: string;
    password: string;
    sessionId: string;
    bypassSession: boolean;
    
    /**
    * Creates new user for user login and authentication.
    */
    constructor(userName: string, password: string) {
        this.userName = userName;
        this.password = password;
        this.sessionId = null;
        this.bypassSession = false;
    }
}
