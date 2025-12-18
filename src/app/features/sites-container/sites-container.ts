import { Component, inject, signal, computed, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, forkJoin, of, catchError, map } from 'rxjs';

import { Site } from '../../shared/models/site';
import { SiteService } from '../../shared/services/site.service';
import { SiteCard } from '../site-card/site-card';
import { Breadcrumb } from '../../shared/models/Breadcrumb';
import { Breadcrumbs } from './components/breadcrumbs/breadcrumbs';
import { Pagination } from './components/pagination/pagination';

const DEFAULT_PAGE = 1;
const PAGE_SIZE = 12;
const ROOT_BREADCRUMB: Breadcrumb = { id: null, name: 'All sites' };

@Component({
  selector: 'app-sites-container',
  imports: [Breadcrumbs, Pagination, SiteCard],
  templateUrl: './sites-container.html',
  styleUrl: './sites-container.scss',
})
export class SitesContainer {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private siteService = inject(SiteService);

  private routeState = toSignal(
    combineLatest({
      siteId: this.route.paramMap.pipe(map(params => params.get('siteId'))),
      page: this.route.queryParamMap.pipe(
        map(query => {
          const p = query.get('page');
          return p && !isNaN(+p) ? Math.max(1, parseInt(p, 10)) : DEFAULT_PAGE;
        })
      ),
    }),
    { initialValue: { siteId: null, page: DEFAULT_PAGE } }
  );

  currentSiteId = computed(() => this.routeState().siteId);
  currentPage = computed(() => this.routeState().page);
  pageSize = PAGE_SIZE;

  loading = signal(false);
  error = signal<string | null>(null);

  sites = signal<Site[]>([]);
  totalPages = signal(0);
  totalItems = signal(0);
  breadcrumbs = signal<Breadcrumb[]>([ROOT_BREADCRUMB]);

  constructor() {
    effect(() => {
      const siteId = this.currentSiteId();
      const page = this.currentPage();
      const pageSize = this.pageSize;

      this.loading.set(true);
      this.error.set(null);

      const subscription = forkJoin({
        sites: this.siteService.getSites(siteId, page, pageSize),
        breadcrumbs: siteId ? this.loadBreadcrumbs(siteId) : of([ROOT_BREADCRUMB]),
      })
        .subscribe({
          next: ({ sites, breadcrumbs }) => {
            this.sites.set(sites.data);
            this.totalPages.set(sites.pagination.totalPages);
            this.totalItems.set(sites.pagination.totalItems);
            this.breadcrumbs.set(breadcrumbs);
            this.loading.set(false);
          },
          error: (err: Error) => {
            this.error.set('Failed to load sites');
            this.loading.set(false);
          },
        });

      return () => subscription.unsubscribe();
    });
  }

  private loadBreadcrumbs(siteId: string) {
    return this.siteService.getSiteAncestorsIds(siteId).pipe(
      map(ancestorIds => [ROOT_BREADCRUMB, ...ancestorIds]),
      catchError(() => of([ROOT_BREADCRUMB]))
    );
  }

  // event handlers
  onNavigateToSite(site: Site): void {
    if (site.isLeaf) return;
    this.navigate(site.id, DEFAULT_PAGE);
  }

  onBreadcrumbClick(crumb: Breadcrumb): void {
    this.navigate(crumb.id, DEFAULT_PAGE);
  }

  onPageChange(page: number): void {
    const clampedPage = Math.max(1, Math.min(page, this.totalPages()));
    this.navigate(this.currentSiteId(), clampedPage);
  }

  private navigate(siteId: string | null, page: number): void {
    if (siteId === this.currentSiteId() && page === this.currentPage()) return;

    const commands = siteId ? ['/sites', siteId] : ['/sites'];
    const queryParams = page > DEFAULT_PAGE ? { page } : {};
    this.router.navigate(commands, { queryParams });
  }
}