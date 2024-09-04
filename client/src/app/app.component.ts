import { Component, inject, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterOutlet } from '@angular/router';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { HourlyTableComponent } from './hourly-table/hourly-table.component';
import { LengthOfStayComponent } from './length-of-stay/length-of-stay.component';
import { StaticTableComponent } from './static-table/static-table.component';
import { DataFetchingService } from './data-fetching.service';
import { DEFAULT_DATE } from './constants';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatTabsModule, StaticTableComponent, HourlyTableComponent, LengthOfStayComponent, DatepickerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  readonly dataFetchingService = inject(DataFetchingService);
  readonly selectedTabIndex = 1;
  readonly title = 'SOR';

  ngOnInit() {
    console.log('Calling ngOnInit ...')
    this.dataFetchingService.fetchRowData(DEFAULT_DATE.toISOString())
  }
}
