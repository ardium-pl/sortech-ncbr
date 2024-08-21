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
      const currentDate = new Date();

      // console.log(`📆 Picked date: `, pickedDate.toISOString());
      // console.log(`📆 Current date: `, currentDate.toISOString());
      console.log(`⚙️ Fetching table data ...`);

      if (pickedDate.setHours(0, 0, 0, 0) < currentDate.setHours(0, 0, 0, 0)) {
        // Update the currentDayOfWeek with the current day
        this.hourlyDataService.currentDayOfWeek.set(pickedDate.getDay());

        // Fetch table data from a database for a chosen day
        this.hourlyDataService.fetchRowData(pickedDate.toISOString());
      } else {
        console.log(`❌ Chosen a date from the future, fetching table data stopeed.`);
      }
    }
  }
}
