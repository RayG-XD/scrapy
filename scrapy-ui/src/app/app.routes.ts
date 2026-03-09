import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { Spiders } from './spiders/spiders';
import { Jobs } from './jobs/jobs';
import { InteractiveShellComponent } from './interactive-shell/interactive-shell';

export const routes: Routes = [
  { path: '', component: Dashboard },
  { path: 'spiders', component: Spiders },
  { path: 'jobs', component: Jobs },
  { path: 'interactive-shell', component: InteractiveShellComponent },
  { path: '**', redirectTo: '' }
];
