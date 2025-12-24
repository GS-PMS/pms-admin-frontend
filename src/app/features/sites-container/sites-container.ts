import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

import { Site } from '../../shared/models/site';
import { SiteService } from '../../shared/services/site.service';
import { Breadcrumbs } from './components/breadcrumbs/breadcrumbs';
import { SitesGrid } from './components/sites-grid/sites-grid';
import { LeafSite } from '../leaf-site/leaf-site';

@Component({
  selector: 'app-sites-container',
  imports: [Breadcrumbs, SitesGrid, LeafSite, TranslateModule],
  templateUrl: './sites-container.html',
  styleUrl: './sites-container.scss',
})
export class SitesContainer {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private siteService = inject(SiteService);

  private routeSiteId = toSignal(this.route.paramMap.pipe(map((params) => params.get('siteId'))), {
    initialValue: null,
  });

  currentSiteId = computed(() => this.routeSiteId());
  currentPath = computed(() => this.currentSite()?.path || '/');

  loading = signal(false);
  error = signal<string | null>(null);
  currentSite = signal<Site | null>(null);
  viewMode = signal<'grid' | 'leaf'>('grid');

  constructor() {
    effect(() => {
      const siteId = this.currentSiteId();

      if (!siteId) {
        this.viewMode.set('grid');
        this.currentSite.set(null);
        this.loading.set(false);
        return;
      }

      this.loading.set(true);
      this.error.set(null);

      const subscription = this.siteService.getSiteById(siteId).subscribe({
        next: (site) => {
          this.currentSite.set(site);
          this.viewMode.set(site.isLeaf ? 'leaf' : 'grid');
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Failed to load site');
          this.loading.set(false);
          this.viewMode.set('grid');
        },
      });

      return () => subscription.unsubscribe();
    });
  }

  onSiteNavigate(site: Site): void {
    if (site.isLeaf) {
      this.router.navigate(['/sites', site.id], {
        state: { site },
      });
    } else {
      this.router.navigate(['/sites', site.id]);
    }
  }
}
