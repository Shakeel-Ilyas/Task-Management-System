import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthResponse } from '../Model/AuthResponse';
import { BehaviorSubject, catchError, Subject, tap, throwError } from 'rxjs';
import { User } from '../Model/User';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';



@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http: HttpClient = inject(HttpClient);
  user = new BehaviorSubject<User>(null);
  router: Router = inject(Router);
  private tokenExpiretimer: any;

  signup(email, password) {
    const data = { email: email, password: password, returnSecureToken: true };
    return this.http
      .post<AuthResponse>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAHGjE1QNq7OnNJh8JLV_6juBhAyF4wfj4' + environment.firebaseAPIKEY,
        data
      )
      .pipe(
        catchError(this.handleError),
        tap((res) => {
          this.handleCreateUser(res);
        })
      );
  }

  login(email, password) {
    const data = { email: email, password: password, returnSecureToken: true };
    return this.http
      .post<AuthResponse>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAHGjE1QNq7OnNJh8JLV_6juBhAyF4wfj4',
        data
      )
      .pipe(
        catchError(this.handleError),
        tap((res) => {
          this.handleCreateUser(res);
        })
      );
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/login']);
    localStorage.clear();

    if (this.tokenExpiretimer) {
      clearTimeout(this.tokenExpiretimer);
      
    }

    this.tokenExpiretimer = null;
  }

  autoLogin() {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
      return;
    }

    const loggedUser = new User(
      user.email,
      user.id,
      user._token,
      user.expiresIn
    );

    if (loggedUser.token) {
      this.user.next(loggedUser);
      const timerValue = (new Date(user.expiresIn).getTime()) - (new Date().getTime())
      this.autoLogout(timerValue);
    }
  }

  autoLogout(expiresTime: number) {
    this.tokenExpiretimer = setTimeout(() => {
      this.logout();
    }, expiresTime);
  }

  private handleCreateUser(res) {
    const expiresInTs = new Date().getTime() + +res.expiresIn * 1000;
    const expiresIn = new Date(expiresInTs);
    const user = new User(res.email, res.localId, res.idToken, expiresIn);
    this.user.next(user);
    this.autoLogout(res.expiresIn * 1000);

    localStorage.setItem('user', JSON.stringify(user));
  }
  private handleError(err) {
    let errorMessage = 'An unknown error has occured';
    console.log(err);
    if (!err.error || !err.error.error) {
      return throwError(() => errorMessage);
    }
    switch (err.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email already exists.';
        break;
      case 'OPERATION_NOT_ALLOWED':
        errorMessage = 'This operation is not allowed.';
        break;
      case 'INVALID_LOGIN_CREDENTIALS':
        errorMessage = 'This email ID or Password is not correct.';
        break;
    }

    return throwError(() => errorMessage);
  }
}
