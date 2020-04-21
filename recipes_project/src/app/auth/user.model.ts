export class AuthenticatedUser{
    constructor(public email,public id,private _token,private _tokenExpiration){}
    get token(){
        
        if(!this._tokenExpiration || new Date() > this._tokenExpiration){
            return null;
        }
        return this._token;
    }
}