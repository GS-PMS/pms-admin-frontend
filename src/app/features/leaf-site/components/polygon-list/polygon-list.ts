import { Component, inject, input, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Polygon } from '../../../../shared/models/polygon';
import { CreatePolygonDto } from '../../../../shared/models/CreatePolygonDto';
import { SiteService } from '../../../../shared/services/site.service';
import { PolygonForm } from '../../../create-site-form/components/polygon-form/polygon-form';
import { FormValidators } from '../../../create-site-form/validators/form-validators';

const MIN_COORDINATES = 3;

@Component({
  selector: 'app-polygon-list',
  imports: [ReactiveFormsModule, PolygonForm],
  templateUrl: './polygon-list.html',
  styleUrl: './polygon-list.scss',
})
export class PolygonList {
  private fb = inject(FormBuilder);
  private siteService = inject(SiteService);

  siteId = input.required<string>();
  polygons = input.required<Polygon[]>();

  polygonAdded = output<Polygon>();

  showAddForm = signal(false);
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

  polygonGroup: FormGroup = this.createPolygonGroup();

  private createPolygonGroup(): FormGroup {
    const group = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          FormValidators.noWhitespaceOnly(),
        ],
      ],
      coordinates: this.fb.array([]),
    });

    for (let i = 0; i < MIN_COORDINATES; i++) {
      this.addCoordinateToGroup(group);
    }

    return group;
  }

  private addCoordinateToGroup(group: FormGroup): void {
    const coordinates = group.get('coordinates') as any;
    coordinates.push(
      this.fb.group({
        latitude: [null, [Validators.required, FormValidators.latitude()]],
        longitude: [null, [Validators.required, FormValidators.longitude()]],
      })
    );
  }

  toggleAddForm(): void {
    this.showAddForm.update((value) => !value);
    if (this.showAddForm()) {
      this.resetForm();
    }
  }

  private resetForm(): void {
    this.polygonGroup = this.createPolygonGroup();
    this.errorMessage.set(null);
  }

  cancelAdd(): void {
    this.showAddForm.set(false);
    this.resetForm();
  }

  submitPolygon(): void {
    if (this.polygonGroup.invalid) {
      this.polygonGroup.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const formValue = this.polygonGroup.value;
    const polygonData: CreatePolygonDto = {
      siteId: this.siteId(),
      name: formValue.name!,
      coordinates: formValue.coordinates!.map((coord: any) => ({
        latitude: coord.latitude,
        longitude: coord.longitude,
      })),
    };

    this.siteService.createPolygon(polygonData).subscribe({
      next: (newPolygon) => {
        this.isSubmitting.set(false);
        this.showAddForm.set(false);
        this.resetForm();
        this.polygonAdded.emit(newPolygon);
      },
      error: (error) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(
          error?.error?.message || 'Failed to create polygon. Please try again.'
        );
      },
    });
  }
}
