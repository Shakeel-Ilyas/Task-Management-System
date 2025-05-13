import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../Services/auth-service';
import { User } from '../Model/User';
import { NgIf } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit, OnDestroy {
  authService: AuthService = inject(AuthService);
  isLoggedIn: boolean = false;
  private userSubject: Subscription;


  ngOnInit() {

    this.userSubject = this.authService.user.subscribe((user: User) => {
      console.log(user)
      this.isLoggedIn = user ? true : false;
    });

  }

  onLogout(){

    this.authService.logout();
    

  }

  ngOnDestroy() {
    this.userSubject.unsubscribe();
  }
}
