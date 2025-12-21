import { Component, inject, input, output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { FormValidators } from '../../validators/form-validators';

const MIN_COORDINATES_PER_POLYGON = 3;

@Component({
  selector: 'app-polygon-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './polygon-form.html',
  styleUrl: './polygon-form.scss',
})
export class PolygonForm {
  private fb = inject(FormBuilder);

  polygonGroup = input.required<FormGroup>();
  polygonIndex = input.required<number>();
  canRemove = input<boolean>(false);

  remove = output<void>();

  get coordinates(): FormArray {
    return this.polygonGroup().get('coordinates') as FormArray;
  }

  addCoordinate(): void {
    const coordGroup = this.fb.group({
      latitude: [null, [Validators.required, FormValidators.latitude()]],
      longitude: [null, [Validators.required, FormValidators.longitude()]],
    });
    this.coordinates.push(coordGroup);
    this.ensureDuplicateValidator();
  }

  private ensureDuplicateValidator(): void {
    if (!this.coordinates.hasValidator(FormValidators.noDuplicateCoordinates)) {
      this.coordinates.addValidators(FormValidators.noDuplicateCoordinates());
    }
    this.coordinates.updateValueAndValidity();
  }

  removeCoordinate(coordIndex: number): void {
    if (this.coordinates.length > MIN_COORDINATES_PER_POLYGON) {
      this.coordinates.removeAt(coordIndex);
    }
  }

  onRemove(): void {
    this.remove.emit();
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.polygonGroup().get(fieldName);
    return !!(control?.invalid && control?.touched);
  }

  isCoordinateFieldInvalid(coordIndex: number, fieldName: string): boolean {
    const control = this.coordinates.at(coordIndex)?.get(fieldName);
    return !!(control?.invalid && control?.touched);
  }

  hasCoordinatesError(): boolean {
    return this.coordinates.invalid && this.coordinates.touched;
  }

  hasDuplicateCoordinatesError(): boolean {
    return !!this.coordinates.errors?.['duplicateCoordinates'];
  }

  isCoordinateDuplicate(coordIndex: number): boolean {
    const error = this.coordinates.errors?.['duplicateCoordinates'];
    return error?.indices?.includes(coordIndex) ?? false;
  }
}
