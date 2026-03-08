import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { Spiders } from './spiders/spiders';

export const routes: Routes = [
  { path: '', component: Dashboard },
  { path: 'spiders', component: Spiders },
  { path: '**', redirectTo: '' }
];
