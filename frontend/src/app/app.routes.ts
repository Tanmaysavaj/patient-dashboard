import { Routes } from '@angular/router';

/**
 * Application Routes
 * Each page is lazy-loaded for optimal bundle splitting.
 * Default route redirects to the dashboard.
 */
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'patients/new',
    loadComponent: () =>
      import('./pages/patient-form/patient-form.component').then(m => m.PatientFormComponent)
  },
  {
    path: 'patients/:id',
    loadComponent: () =>
      import('./pages/patient-detail/patient-detail.component').then(m => m.PatientDetailComponent)
  },
  {
    // Wildcard — redirect unknown routes to dashboard
    path: '**',
    redirectTo: 'dashboard'
  }
];
