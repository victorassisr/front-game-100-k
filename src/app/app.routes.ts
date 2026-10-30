import { Routes } from '@angular/router';
import { SavingsDashboardComponent } from './pages/savings-dashboard/savings-dashboard.component';

export const routes: Routes = [
  { path: '', component: SavingsDashboardComponent },
  { path: '**', redirectTo: '' }
];