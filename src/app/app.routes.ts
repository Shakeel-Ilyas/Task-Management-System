import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { canActivate } from './RouteGuard/authGuard';
import { OverviewComponent } from './dashboard/overview/overview.component';
import { StatsComponent } from './dashboard/stats/stats.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    canActivate: [canActivate],
    children: [
      { path: 'overview', component: OverviewComponent },
      { path: 'stats', component: StatsComponent },
    ],
  },
];
