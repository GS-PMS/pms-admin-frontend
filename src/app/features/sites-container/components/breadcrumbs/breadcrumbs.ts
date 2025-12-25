import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, of, catchError } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { Breadcrumb } from '../../../../shared/models/Breadcrumb';
import { SiteService } from '../../../../shared/services/site.service';

@Component({
  selector: 'app-breadcrumbs',
  imports: [TranslateModule],
  templateUrl: './breadcrumbs.html',
  styleUrl: './breadcrumbs.scss',
})
export class Breadcrumbs {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private siteService = inject(SiteService);
  private translate = inject(TranslateService);

  private routeSiteId = toSignal(this.route.paramMap.pipe(map((params) => params.get('siteId'))), {
    initialValue: null,
  });

  currentSiteId = computed(() => this.routeSiteId());
  breadcrumbs = signal<Breadcrumb[]>([this.getRootBreadcrumb()]);

  private getRootBreadcrumb(): Breadcrumb {
    return { id: null, nameEn: 'Root Sites', nameAr: 'المواقع الأساسية' };
  }

  constructor() {
    this.translate.onLangChange.subscribe(() => {
      const current = this.breadcrumbs();
      if (current.length > 0 && current[0].id === null) {
        this.breadcrumbs.set([this.getRootBreadcrumb(), ...current.slice(1)]);
      }
    });

    effect(() => {
      const siteId = this.currentSiteId();
      if (!siteId) {
        this.breadcrumbs.set([this.getRootBreadcrumb()]);
        return;
      }

      this.siteService
        .getSiteAncestorsIds(siteId)
        .pipe(
          map((ancestorIds) => [this.getRootBreadcrumb(), ...ancestorIds]),
          catchError(() => of([this.getRootBreadcrumb()]))
        )
        .subscribe((breadcrumbs) => {
          this.breadcrumbs.set(breadcrumbs);
        });
    });
  }

  onBreadcrumbClick(crumb: Breadcrumb): void {
    const siteId = crumb.id;
    if (siteId) {
      this.router.navigate(['/sites', siteId]);
    } else {
      this.router.navigate(['/sites']);
    }
  }

  getBreadcrumbName(crumb: Breadcrumb): string {
    return this.translate.getCurrentLang() === 'en' ? crumb.nameEn : crumb.nameAr;
  }
}
