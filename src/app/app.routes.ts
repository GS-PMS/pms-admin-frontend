import { Routes } from '@angular/router';
import { SitesContainer } from './features/sites-container/sites-container';
import { CreateSiteForm } from './features/create-site-form/create-site-form';

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
    path: 'sites/new',
    component: CreateSiteForm,
  },
  {
    path: 'sites/:siteId',
    component: SitesContainer,
  },
  {
    path: 'sites/:siteId/new',
    component: CreateSiteForm,
  },
];
