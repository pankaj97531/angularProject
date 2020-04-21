import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Subject, BehaviorSubject } from 'rxjs';
import { AuthenticatedUser } from './user.model';
import { Router } from '@angular/router';
//api key AIzaSyAbSapQhkjbX9rHQAywXsa2PPJk4Zu_d5c
export interface AuthResponseData{
    idToken : string;
    email : string;
    refreshToken : string;
    expiresIn : string;
    localId : string;
    registered?: boolean;
}
@Injectable({providedIn : "root" })
export class AuthService{
    authenticatedUser = new BehaviorSubject<AuthenticatedUser>(null);
    
    private logoutTimer : any;
    constructor(private http: HttpClient,private router : Router){}

    signUpRequest(email : string,password : string){
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAbSapQhkjbX9rHQAywXsa2PPJk4Zu_d5c',{
        email : email,
        password : password,
        returnSecureToken : true
        }).pipe(catchError(this.errorHandler),tap(resData=>{
            this.authDetails(resData.email,resData.localId,resData.idToken,+resData.expiresIn);
        }))
    }
    autoLogin(){
        const loggedData : {
            email : string;
            id : string;
            _token : string;
            _tokenExpiration : string;
        } = JSON.parse(localStorage.getItem('userData'));
        if(!loggedData){
            return;
        } 
        const loggedUser = new AuthenticatedUser(loggedData.email,loggedData.id,loggedData._token,loggedData._tokenExpiration);
        if(loggedUser.token){
            this.authenticatedUser.next(loggedUser);
        }
        const expirationTime = new Date(loggedData._tokenExpiration).getTime() - new Date().getTime();
            //console.log(expirationTime);
            this.autoLogout(expirationTime);
        
    }
    loginRequest(email : string,password : string){
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAbSapQhkjbX9rHQAywXsa2PPJk4Zu_d5c',
        {
            email : email,
            password : password,
            returnSecureToken : true
            }
        ).pipe(catchError(this.errorHandler),tap(resData=>{
            this.authDetails(resData.email,resData.localId,resData.idToken,+resData.expiresIn);
        }))

    }
    logout(){
        this.authenticatedUser.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if(this.logoutTimer){
            clearTimeout(this.logoutTimer);
        }
        this.logoutTimer = null;
    }
    autoLogout(expirationTime : number){
        
       this.logoutTimer= setTimeout(()=>{
            this.logout();
        },expirationTime);
    }
    private authDetails(email: string,localId:string,idToken:string,expiresIn:number){
        let expiredInTime = new Date(new Date().getTime()+ expiresIn*1000); 
            let loggedInUser = new AuthenticatedUser(email,localId,idToken,expiredInTime);
            this.authenticatedUser.next(loggedInUser);
//            console.log(expiredInTime.getTime());
//            console.log(new Date().getTime());
            
            localStorage.setItem('userData',JSON.stringify(loggedInUser));
    }
    private errorHandler(errorRes : HttpErrorResponse){
        let errorMessage = "Unkonwn error";
        if(!errorRes.error || !errorRes.error.error){
           return throwError(errorMessage)
        }
        switch(errorRes.error.error.message){
            case "EMAIL_EXISTS" : 
            errorMessage = "Email Id already exists";
            break;
            case 'EMAIL_NOT_FOUND' : 
            errorMessage = "Email Id not exists";
            break;
            case 'INVALID_PASSWORD' : 
            errorMessage = "Password not right.";
            break;
        }
       return throwError(errorMessage)
    }
}