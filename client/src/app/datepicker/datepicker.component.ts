import { Component, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DataFetchingService } from '../data-fetching.service';
import { HourlyDataService } from '../hourly-data.service';

@Component({
  selector: 'app-datepicker',
  standalone: true,
  imports: [MatDatepickerModule, MatFormFieldModule, FormsModule, MatInputModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './datepicker.component.html',
  styleUrl: './datepicker.component.scss',
})
export class DatepickerComponent {
  readonly hourlyDataService = inject(HourlyDataService);
  readonly dataFetchingService = inject(DataFetchingService);
  readonly value = model < Date | null>(null);
}
