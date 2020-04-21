import { CanActivate, Router, UrlTree } from '@angular/router';
import { ActivatedRouteSnapshot,RouterStateSnapshot } from '@angular/router';
import { Observable, from } from 'rxjs';
import { Injectable } from '@angular/core';
import { map,tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
@Injectable({providedIn : 'root'})
export class AuthGuardService implements CanActivate{
    constructor(private authService : AuthService,private router : Router){}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> | Observable<boolean | UrlTree> {
        return this.authService.authenticatedUser.pipe(map(userData=>{
            let authUser = !!userData;
            console.log(!authUser);
            if(authUser){
                return true
            }else{
                this.router.navigate(['/auth']);

            }
        })
        // ,tap(authData=>{
        //     if(!authData){
        //        this.router.navigate(['/auth']); 
        //     }
        // })
        )
//        return true;
    }
}