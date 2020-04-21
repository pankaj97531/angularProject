import { Component, OnInit, ComponentFactoryResolver, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService,AuthResponseData } from './auth.service';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AlertComponent } from '../alertComponent/alert.component';
import { PlaceholderDirective } from '../shared/customDirective/placeholder.directive';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy{
  isLogin=false;
  isLoading = false;
  errorMessage=null;
  @ViewChild(PlaceholderDirective,{static : false}) hostAlert : PlaceholderDirective;
  private cancelSub : Subscription;
  constructor(private authService : AuthService,private router : Router,private componentFatoryResolver : ComponentFactoryResolver){}
  ngOnInit(){
    this.authService.authenticatedUser.subscribe(
      (userData)=>{
        if(userData){
          console.log(userData);
         this.router.navigate(['/recipes']);
        }

      }
    );
   

  }
  onSubmit(formData : NgForm){
    this.errorMessage=null;
    if(!formData.valid){
      return;
    }
    let authObsr : Observable<AuthResponseData>;
    this.isLoading = true;
    let email = formData.value.email;
    let password = formData.value.password;
    if(this.isLogin){
      authObsr=this.authService.loginRequest(email,password);
    }else{
      authObsr= this.authService.signUpRequest(email,password);
    }
    authObsr.subscribe(
      (response)=>{
      //  console.log(response);
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      },errorRes=>{
        //console.log(errorRes);
        this.isLoading = false;
        this.errorMessage = errorRes;
        this.onShowError(errorRes);
      }
    )
    formData.reset();
  }
  onSwitchMode(){
    this.isLogin = !this.isLogin;
  }
  onCloseAlert(){
    this.errorMessage=null;
  }
  onShowError(message : string){
    let alertCmpFactory=this.componentFatoryResolver.resolveComponentFactory(AlertComponent);
    //alertCmpFactory.
    let hostContainerRef = this.hostAlert.viewContainerRef;
    hostContainerRef.clear();
    let containerRef = hostContainerRef.createComponent(alertCmpFactory);
    containerRef.instance.message=message;
    this.cancelSub=containerRef.instance.cancelAlert.subscribe(()=>{
      hostContainerRef.clear();
      this.cancelSub.unsubscribe();
    })
  }
  ngOnDestroy(){
    if(this.cancelSub){
      this.cancelSub.unsubscribe();
    }
  }
}
