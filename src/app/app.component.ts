import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from "./footer/footer.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { HeaderComponent } from "./header/header.component";
import { AuthService } from './Services/auth-service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FooterComponent, RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  authService: AuthService = inject(AuthService)
  title = 'angular-http-client';

  ngOnInit(): void {
    this.authService.autoLogin()
  }
}
