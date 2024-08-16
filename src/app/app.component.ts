import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterOutlet } from '@angular/router';
import { DatepickerComponent } from './components/datepicker/datepicker.component';
import { HourlyTableComponent } from './hourly-table/hourly-table.component';
import { LengthOfStayComponent } from './length-of-stay/length-of-stay.component';
import { StaticTableComponent } from './static-table/static-table.component';
import { UserFormComponent } from './user-form/user-form.component';
import { WebForm1Component } from './web-form1/web-form1.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatTabsModule,
    StaticTableComponent,
    HourlyTableComponent,
    LengthOfStayComponent,
    DatepickerComponent,
    UserFormComponent,
    WebForm1Component
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  readonly selectedTabIndex = 1;
  title = 'SOR';

  onChange(event: any) {
    // console.log(event);
  }
}
