import { Component, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HourlyDataService } from '../../hourly-data.service';

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
  readonly value = model<Date>(new Date());

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    const pickedDate = event.value;

    // Update the currentDayOfWeek with the current day
    if (pickedDate) {
      this.hourlyDataService.currentDayOfWeek.set(pickedDate.getDay());
      this.hourlyDataService.applySummaryCalcuationsForPinnedRows();
    }
  }
}
