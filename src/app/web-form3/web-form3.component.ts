import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { textValidator, numberValidator, dateValidator, timeValidator } from './form-validators';

@Component({
  selector: 'app-web-form3',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './web-form3.component.html',
  styleUrl: './web-form3.component.scss',
})
export class WebForm3Component {
  readonly patientForm = new FormGroup({
    firstName: new FormControl('', [Validators.required, textValidator()]),
    lastName: new FormControl('', [Validators.required, textValidator()]),
    numberPESEL: new FormControl(null, [
      Validators.required,
      Validators.minLength(11),
      Validators.maxLength(11),
      Validators.pattern(/^\d+$/),
    ]),
    patientType: new FormControl('', [Validators.required]),
    arrivalDate: new FormControl('', [Validators.required, dateValidator()]),
    arrivalHour: new FormControl('', [Validators.required, Validators.pattern(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/)]),
  });

  onSubmit() {
    console.log(JSON.stringify(this.patientForm.value, null, 4));
  }
}
