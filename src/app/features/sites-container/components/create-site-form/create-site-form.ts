import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SiteService } from '../../../../shared/services/site.service';
import { Site } from '../../../../shared/models/site';

@Component({
  selector: 'app-create-site-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-site-form.html',
  styleUrl: './create-site-form.scss',
})
export class CreateSiteForm {
  private fb = inject(FormBuilder);
  private siteService = inject(SiteService);

  parentId = input<string | null>(null);
  currentPath = input<string>('');
  siteCreated = output<Site>();
  cancelled = output<void>();

  siteForm: FormGroup;
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  constructor() {
    this.siteForm = this.fb.group({
      nameAr: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      nameEn: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      path: [{ value: '', disabled: true }],
      isLeaf: [false],
      integrationCode: ['', [Validators.required]],
    });

    effect(() => {
      const currentPath = this.currentPath();
      this.siteForm.patchValue({ path: currentPath || '/' });
    });
  }

  onSubmit(): void {
    if (this.siteForm.invalid) {
      this.siteForm.markAllAsTouched();
      return;
    }

    const formValue = this.siteForm.getRawValue();

    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const siteData = {
      name: {
        ar: formValue.nameAr,
        en: formValue.nameEn,
      },
      path: formValue.path,
      isLeaf: formValue.isLeaf,
      parentId: this.parentId(),
      integrationCode: formValue.integrationCode,
    };

    this.siteService.createSite(siteData).subscribe({
      next: (site) => {
        this.isSubmitting.set(false);
        this.successMessage.set('Site created successfully!');
        this.siteCreated.emit(site);
      },
      error: (error) => {
        this.isSubmitting.set(false);
        const errorMsg =
          error?.error?.message ||
          error?.message ||
          'Failed to create site. Please try again.';
        this.errorMessage.set(errorMsg);
      },
    });
  }

  onCancel(): void {
    this.resetForm();
    this.cancelled.emit();
  }

  resetForm(): void {
    this.siteForm.reset({
      nameAr: '',
      nameEn: '',
      path: this.currentPath() || '/',
      isLeaf: false,
      integrationCode: '',
    });
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }
}