import { AbstractControl, ValidationErrors, ValidatorFn, FormArray } from '@angular/forms';

const ARABIC_REGEX = /^[\u0600-\u06FF\u0660-\u06690-9\s\-\_\.,!@#\$%\^&\*\(\)]+$/;
const ENGLISH_REGEX = /^[a-zA-Z0-9\s\-\_\.,!@#\$%\^&\*\(\)]+$/;
const INTEGRATION_CODE_REGEX = /^[A-Za-z0-9 _.-]+$/;

export class FormValidators {
  static noWhitespaceOnly(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const isWhitespaceOnly = String(control.value).trim().length === 0;
      return isWhitespaceOnly ? { whitespaceOnly: true } : null;
    };
  }

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

  static integrationCodeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return INTEGRATION_CODE_REGEX.test(control.value) ? null : { codeValidation: true };
    };
  }

  static latitude(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === null || control.value === undefined || control.value === '')
        return null;
      const value = Number(control.value);
      if (value < -90 || value > 90) return { latitude: true };

      const decimalPart = String(control.value).split('.')[1];
      if (decimalPart && decimalPart.length > 6) return { maxDecimals: { max: 6 } };
      return null;
    };
  }

  static longitude(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === null || control.value === undefined || control.value === '')
        return null;
      const value = Number(control.value);
      if (value < -180 || value > 180) return { longitude: true };

      const decimalPart = String(control.value).split('.')[1];
      if (decimalPart && decimalPart.length > 6) return { maxDecimals: { max: 6 } };
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

  static integer(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === null || control.value === undefined || control.value === '')
        return null;
      const value = Number(control.value);
      if (!Number.isInteger(value)) {
        return { integer: true };
      }
      return null;
    };
  }

  static noDuplicateCoordinates(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formArray = control as FormArray;
      if (!formArray || !formArray.controls || formArray.controls.length < 2) {
        return null;
      }

      const coordinates = formArray.controls.map((group) => {
        const lat = group.get('latitude')?.value;
        const lng = group.get('longitude')?.value;
        return { lat, lng };
      });

      const duplicateIndices: number[] = [];
      for (let i = 0; i < coordinates.length; i++) {
        const { lat: lat1, lng: lng1 } = coordinates[i];
        if (lat1 === null || lat1 === undefined || lng1 === null || lng1 === undefined) {
          continue;
        }
        for (let j = i + 1; j < coordinates.length; j++) {
          const { lat: lat2, lng: lng2 } = coordinates[j];
          if (lat2 === null || lat2 === undefined || lng2 === null || lng2 === undefined) {
            continue;
          }
          if (Number(lat1) === Number(lat2) && Number(lng1) === Number(lng2)) {
            if (!duplicateIndices.includes(i)) duplicateIndices.push(i);
            if (!duplicateIndices.includes(j)) duplicateIndices.push(j);
          }
        }
      }

      if (duplicateIndices.length > 0) {
        return { duplicateCoordinates: { indices: duplicateIndices } };
      }
      return null;
    };
  }
}
