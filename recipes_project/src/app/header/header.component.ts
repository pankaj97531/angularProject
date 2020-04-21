import { Component, OnInit } from '@angular/core';

import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit{
  isAuthenticated = false;
  constructor(private dataStorageService: DataStorageService,private authService : AuthService) {}
  ngOnInit(){
    this.authService.authenticatedUser.subscribe(
      (user)=>{
        
        this.isAuthenticated= !!user;
      }
    );
  }

  onSaveData() {
    this.dataStorageService.storeRecipes();
  }

  onFetchData() {
    this.dataStorageService.fetchRecipes().subscribe();
  }
  onLogout(){
    this.authService.logout();
  }
}
