import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { DatepickerComponent } from './components/datepicker/datepicker.component';
import { HourlyTableComponent } from './hourly-table/hourly-table.component';
import { LengthOfStayComponent } from './length-of-stay/length-of-stay.component';
import { StaticTableComponent } from './static-table/static-table.component';
import { WebForm1Component } from './web-form1/web-form1.component';
import { WebForm3Component } from './web-form3/web-form3.component';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    MatTabsModule,
    StaticTableComponent,
    HourlyTableComponent,
    LengthOfStayComponent,
    DatepickerComponent,
    WebForm1Component,
    WebForm3Component,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  readonly selectedTabIndex = 2;
  title = 'SOR';

  onChange(event: any) {
    // console.log(event);
  }
}
