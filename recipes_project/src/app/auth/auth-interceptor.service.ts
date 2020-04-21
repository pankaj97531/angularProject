import { HttpInterceptor, HttpRequest, HttpHandler, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {take,exhaustMap} from 'rxjs/operators'
import { AuthService } from './auth.service';
import { from } from 'rxjs';
@Injectable({providedIn:"root"})
export class AuthinterceptorService implements HttpInterceptor{
    constructor(private authService : AuthService){}
    intercept(req : HttpRequest<any> ,next : HttpHandler){
        return this.authService.authenticatedUser.pipe(take(1),exhaustMap(userData=>{
            if(!userData){
                return next.handle(req)
            }
            let modifiedReq = req.clone({
                params : new HttpParams().set('auth',userData.token)
            }); 
            return next.handle(modifiedReq);
        }))

    }
}