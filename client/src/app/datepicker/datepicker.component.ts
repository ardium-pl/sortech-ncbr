import { Component, inject } from '@angular/core';
import {  FormControl, ReactiveFormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HourlyDataService } from '../hourly-data.service';
import { DataFetchingService } from '../data-fetching.service';
import { DEFAULT_DATE } from '../constants';

@Component({
  selector: 'app-datepicker',
  standalone: true,
  imports: [MatDatepickerModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './datepicker.component.html',
  styleUrl: './datepicker.component.scss',
})
export class DatepickerComponent {
  readonly hourlyDataService = inject(HourlyDataService);
  readonly dataFetchingService = inject(DataFetchingService);
  readonly defaultDate = new FormControl(DEFAULT_DATE);

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    const pickedDate = event.value;

    if (pickedDate) {
      console.log(`⚙️ Fetching table data ...`);

      // Fetch table data from a database for a chosen day
      this.dataFetchingService.fetchRowData(pickedDate.toISOString());
    }
  }
}
