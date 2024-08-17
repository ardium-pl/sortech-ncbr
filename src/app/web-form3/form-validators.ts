import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Custom Validator: Ensure the value is not an empty string or whitespace and is textual
export function textValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    // Trim leading or trailing whitespace
    const value = control.value?.trim();
    if (value && /^[a-zA-Z\s]+$/.test(value.trim())) {
      return null;
    }
    return { nonEmptyText: { value: control.value } };
  };
}

// Custom Validator: Ensure the value is a sequence of 11 digits
export function numberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (/^\d*$/.test(value)) {
      return null;
    }
    return { nonNumberInput: { value: control.value } };
  };
}

// Custom Validator: Ensure the value is a valid date string
export function dateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!isNaN(Date.parse(value))) {
      return null;
    }
    return { invalidDate: { value: control.value } };
  };
}

// Custom Validator: Ensure the value is a valid time string
export function timeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(value)) {
      return null;
    }
    return { invalidHour: { value: control.value } };
  };
}
