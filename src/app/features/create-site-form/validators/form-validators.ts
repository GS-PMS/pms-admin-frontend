import { AbstractControl, ValidationErrors, ValidatorFn, FormArray } from '@angular/forms';

const ARABIC_REGEX = /^[\u0600-\u06FF\u0660-\u06690-9\s\-\_\.,!@#\$%\^&\*\(\)]+$/;
const ENGLISH_REGEX = /^[a-zA-Z0-9\s\-\_\.,!@#\$%\^&\*\(\)]+$/;

export class FormValidators {
  static arabicOnly(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      return ARABIC_REGEX.test(control.value) ? null : { arabicOnly: true };
    };
  }

  static englishOnly(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      return ENGLISH_REGEX.test(control.value) ? null : { englishOnly: true };
    };
  }

  static latitude(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === null || control.value === undefined || control.value === '')
        return null;
      const value = Number(control.value);
      if (value < -90 || value > 90) return { latitude: true };

      // enfore minimum of 4 decimals
      const decimalPart = String(control.value).split('.')[1];
      if (!decimalPart || decimalPart.length < 4) return { minDecimals: { min: 4 } };
      return null;
    };
  }

  static longitude(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === null || control.value === undefined || control.value === '')
        return null;
      const value = Number(control.value);
      if (value < -180 || value > 180) return { longitude: true };

      // enfore minimum of 4 decimals
      const decimalPart = String(control.value).split('.')[1];
      if (!decimalPart || decimalPart.length < 4) return { minDecimals: { min: 4 } };
      return null;
    };
  }

  static maxDecimalPlaces(maxDecimals: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === null || control.value === undefined || control.value === '')
        return null;

      const decimalPart = String(control.value).split('.')[1];
      if (decimalPart && decimalPart.length > maxDecimals) {
        return { maxDecimals: { max: maxDecimals, actual: decimalPart.length } };
      }
      return null;
    };
  }
}
