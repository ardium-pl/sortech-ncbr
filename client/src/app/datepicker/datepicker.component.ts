import { Component, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HourlyDataService } from '../hourly-data.service';

@Component({
  selector: 'app-datepicker',
  standalone: true,
  imports: [MatDatepickerModule, MatFormFieldModule, MatInputModule, FormsModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './datepicker.component.html',
  styleUrl: './datepicker.component.scss',
})
export class DatepickerComponent {
  readonly hourlyDataService = inject(HourlyDataService);
  readonly value = model<Date>();

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    const pickedDate = event.value;

    if (pickedDate) {
      console.log(`⚙️ Fetching table data ...`);

      // Update the currentDayOfWeek
      this.hourlyDataService.currentDayOfWeek.set(pickedDate.getDay());
      
      // Manually adjust the timezone to GMT +2.00 and build the ISO string
      const timezoneOffset = 2 * 60; // GMT +2.00 in minutes
      const adjustedISODate = new Date(pickedDate.getTime() - pickedDate.getTimezoneOffset() * 60000 + timezoneOffset * 60000)
        .toISOString()
        .replace('Z', '+02:00');

      this.hourlyDataService.fetchRowData(adjustedISODate);
    }
  }
}
