import { Routes } from '@angular/router';
import { SitesContainer } from './features/sites-container/sites-container';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'sites',
  },
  {
    path: 'sites',
    component: SitesContainer,
  },
  {
    path: 'sites/:siteId',
    component: SitesContainer,
  },
];
