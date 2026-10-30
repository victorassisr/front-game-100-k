import { Routes } from '@angular/router';
import { SavingsDashboardComponent } from './pages/savings-dashboard/savings-dashboard.component';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: SavingsDashboardComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];