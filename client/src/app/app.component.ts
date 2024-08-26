import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterOutlet } from '@angular/router';
import { DatepickerComponent } from './components/datepicker/datepicker.component';
import { HourlyTableComponent } from './hourly-table/hourly-table.component';
import { LengthOfStayComponent } from './length-of-stay/length-of-stay.component';
import { StaticTableComponent } from './static-table/static-table.component';
import { apiUrl } from './utils/apiUrl';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatTabsModule, StaticTableComponent, HourlyTableComponent, LengthOfStayComponent, DatepickerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  readonly selectedTabIndex = 1;
  title = 'SOR';

  private _http = (inject(HttpClient))

  onChange(date: Date) {
    this._http.get(apiUrl('/dane'), { params: { date: date.toISOString() } }).subscribe(v => {
      console.log(v);
    })
  }
}
