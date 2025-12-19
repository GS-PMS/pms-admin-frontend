import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, of, catchError } from 'rxjs';

import { Breadcrumb } from '../../../../shared/models/Breadcrumb';
import { SiteService } from '../../../../shared/services/site.service';

const ROOT_BREADCRUMB: Breadcrumb = { id: null, name: 'All sites' };

@Component({
  selector: 'app-breadcrumbs',
  imports: [],
  templateUrl: './breadcrumbs.html',
  styleUrl: './breadcrumbs.scss',
})
export class Breadcrumbs {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private siteService = inject(SiteService);

  private routeSiteId = toSignal(
    this.route.paramMap.pipe(map(params => params.get('siteId'))),
    { initialValue: null }
  );

  currentSiteId = computed(() => this.routeSiteId());
  breadcrumbs = signal<Breadcrumb[]>([ROOT_BREADCRUMB]);

  constructor() {
    effect(() => {
      const siteId = this.currentSiteId();
      if (!siteId) {
        this.breadcrumbs.set([ROOT_BREADCRUMB]);
        return;
      }

      this.siteService
        .getSiteAncestorsIds(siteId)
        .pipe(
          map(ancestorIds => [ROOT_BREADCRUMB, ...ancestorIds]),
          catchError(() => of([ROOT_BREADCRUMB]))
        )
        .subscribe(breadcrumbs => {
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
}

