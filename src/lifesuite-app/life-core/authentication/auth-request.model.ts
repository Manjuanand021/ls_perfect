/**
 * Generic user interface implementation for authentication.
 */
export class LoginRequest {
    public readonly $type: string = 'life.common.LoginRequest, UICommon';

    public loginName: string;
    public password: string;
    public loadGroup: number;
    public timezoneOffset: number;
    public userLanguage: string;
    public isADSSOEnabled: boolean;

    /**
     * Creates new user for user login and authentication.
     */
    constructor(userName: string, password: string) {
        this.loginName = userName;
        this.password = password;
    }
}

export class LoginResponse {
    public LoginName: string;
    public UserID: number;
    public UserName: string;
    public SessionTimeoutMinutes: number;
}

export class LogoutRequest {
    public readonly $type: string = 'life.common.LogoutRequest, UICommon';
    public userName: string;

    constructor(userName: string) {
        this.userName = userName;
    }
}

export type LogoutResponse = string;
