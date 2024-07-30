import { Routes } from '@angular/router';
import { StaticTableComponent } from './static-table/static-table.component';
import { HourlyTableComponent } from './hourly-table/hourly-table.component';

export const routes: Routes = [
  { path: '', component: StaticTableComponent },
  { path: 'hourly-table', component: HourlyTableComponent },
];
