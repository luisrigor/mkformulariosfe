export type AuthenticationType = {
    clientId: number;
    roles: string[];
    token: string;
}

export class AuthenticationModel {
    public clientId = '';
    public roles = '';
    public token = false;

    toModel () {
        return {
            clientId: this.clientId,
            roles: this.roles,
            token: this.token
        };
    }
}

export type AuthenticationSendType = {
    loginToken: string;
}

export class AuthenticationSendModel {
    public loginToken = '';

    toModel () {
        return {
            loginToken: this.loginToken
        };
    }
}