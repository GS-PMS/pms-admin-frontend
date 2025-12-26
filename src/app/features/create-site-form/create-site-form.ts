import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FormValidators } from './validators/form-validators';
import { SiteService } from '../../shared/services/site.service';
import { CreateSiteDto } from '../../shared/models/CreateSiteDto';
import { PolygonForm } from './components/polygon-form/polygon-form';
import { timeout } from 'rxjs';

const MIN_COORDINATES_PER_POLYGON = 3;
const MIN_POLYGONS_FOR_LEAF = 1;

@Component({
  selector: 'app-create-site-form',
  standalone: true,
  imports: [ReactiveFormsModule, PolygonForm, TranslateModule],
  templateUrl: './create-site-form.html',
  styleUrl: './create-site-form.scss',
})
export class CreateSiteForm implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private siteService = inject(SiteService);

  form!: FormGroup;
  parentId: string | null = null;
  currentPath = '/';

  submitting = signal(false);
  submitError = signal<string | null>(null);
  submitSuccess = signal(false);

  ngOnInit(): void {
    this.parentId = this.route.snapshot.paramMap.get('siteId');
    this.currentPath = this.route.snapshot.queryParamMap.get('path') || '/';

    this.initForm();
  }

  private initForm(): void {
    this.form = this.fb.group({
      nameEn: [
        '',
        [
          Validators.required,
          FormValidators.noWhitespaceOnly(),
          Validators.minLength(3),
          Validators.maxLength(100),
          FormValidators.englishOnly(),
        ],
      ],
      nameAr: [
        '',
        [
          Validators.required,
          FormValidators.noWhitespaceOnly(),
          Validators.minLength(3),
          Validators.maxLength(100),
          FormValidators.arabicOnly(),
        ],
      ],
      integrationCode: [
        '',
        [
          Validators.required,
          FormValidators.noWhitespaceOnly(),
          Validators.minLength(3),
          Validators.maxLength(100),
          FormValidators.integrationCodeValidator(),
        ],
      ],
      path: [{ value: this.currentPath, disabled: true }],
      isLeaf: [false],
      pricePerHour: [null],
      numberOfSlots: [null],
      polygons: this.fb.array([]),
    });

    this.form.get('isLeaf')?.valueChanges.subscribe((isLeaf) => {
      this.onIsLeafChange(isLeaf);
    });
  }

  private onIsLeafChange(isLeaf: boolean): void {
    const priceControl = this.form.get('pricePerHour');
    const slotsControl = this.form.get('numberOfSlots');
    const polygonsArray = this.polygons;

    if (isLeaf) {
      priceControl?.setValidators([
        Validators.required,
        Validators.min(0),
        FormValidators.maxDecimalPlaces(2),
      ]);
      slotsControl?.setValidators([
        Validators.required,
        Validators.min(1),
        Validators.max(10000),
        FormValidators.integer(),
      ]);
      polygonsArray.setValidators([Validators.minLength(MIN_POLYGONS_FOR_LEAF)]);

      if (polygonsArray.length === 0) {
        this.addPolygon();
      }
    } else {
      priceControl?.clearValidators();
      slotsControl?.clearValidators();
      polygonsArray.clearValidators();

      while (polygonsArray.length > 0) {
        polygonsArray.removeAt(0);
      }
    }

    priceControl?.updateValueAndValidity();
    slotsControl?.updateValueAndValidity();
    polygonsArray.updateValueAndValidity();
  }

  get polygons(): FormArray {
    return this.form.get('polygons') as FormArray;
  }

  addPolygon(): void {
    const polygonGroup = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          FormValidators.noWhitespaceOnly(),
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      coordinates: this.fb.array(
        [],
        [Validators.minLength(MIN_COORDINATES_PER_POLYGON), FormValidators.noDuplicateCoordinates()]
      ),
    });

    // add minimum 3 coordinates by default
    const coordsArray = polygonGroup.get('coordinates') as FormArray;
    for (let i = 0; i < MIN_COORDINATES_PER_POLYGON; i++) {
      this.addCoordinateToArray(coordsArray);
    }

    this.polygons.push(polygonGroup);
  }

  removePolygon(index: number): void {
    if (this.polygons.length > MIN_POLYGONS_FOR_LEAF) {
      this.polygons.removeAt(index);
    }
  }

  private addCoordinateToArray(coordsArray: FormArray): void {
    const coordGroup = this.fb.group({
      latitude: [null, [Validators.required, FormValidators.latitude()]],
      longitude: [null, [Validators.required, FormValidators.longitude()]],
    });
    coordsArray.push(coordGroup);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.submitError.set(null);
    this.submitSuccess.set(false);

    const formValue = this.form.getRawValue();
    const isLeaf = formValue.isLeaf;

    const siteData: CreateSiteDto = {
      name: {
        en: formValue.nameEn,
        ar: formValue.nameAr,
      },
      path: formValue.path,
      isLeaf: isLeaf,
      integrationCode: formValue.integrationCode,
      parentId: this.parentId,
    };

    if (isLeaf) {
      siteData.pricePerHour = Number(formValue.pricePerHour);
      siteData.numberOfSlots = Number(formValue.numberOfSlots);
      siteData.polygons = formValue.polygons.map((p: any) => ({
        name: p.name,
        coordinates: p.coordinates.map((c: any) => ({
          latitude: Number(c.latitude),
          longitude: Number(c.longitude),
        })),
      }));
    }

    this.siteService.createSite(siteData).subscribe({
      next: () => {
        this.submitting.set(false);
        this.submitSuccess.set(true);
      },
      error: (err) => {
        console.log(err);
        this.submitting.set(false);
        this.submitError.set(err?.error || 'Failed to create site. Please try again.');
        this.submitSuccess.set(false);
      },
    });
  }

  onCancel(): void {
    this.navigateBack();
  }

  navigateBack(): void {
    if (this.parentId) {
      this.router.navigate(['/sites', this.parentId]);
    } else {
      this.router.navigate(['/sites']);
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.form.get(fieldName);
    return !!(control?.invalid && control?.touched);
  }

  hasPolygonError(): boolean {
    return this.polygons.invalid && this.polygons.touched;
  }

  getPolygonGroup(index: number): FormGroup {
    return this.polygons.at(index) as FormGroup;
  }
}
