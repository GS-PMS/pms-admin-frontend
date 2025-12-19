import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

import { Site } from '../../../../shared/models/site';
import { SiteService } from '../../../../shared/services/site.service';
import { SiteCard } from '../../../site-card/site-card';
import { Pagination } from '../pagination/pagination';
import { CreateSiteForm } from '../create-site-form/create-site-form';

const DEFAULT_PAGE = 1;
const PAGE_SIZE = 12;

@Component({
  selector: 'app-sites-grid',
  imports: [SiteCard, Pagination, CreateSiteForm],
  templateUrl: './sites-grid.html',
  styleUrl: './sites-grid.scss',
})
export class SitesGrid {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private siteService = inject(SiteService);

  parentId = input<string | null>(null);
  siteNavigate = output<Site>();

  private routePage = toSignal(
    this.route.queryParamMap.pipe(
      map(query => {
        const p = query.get('page');
        return p && !isNaN(+p) ? Math.max(1, parseInt(p, 10)) : DEFAULT_PAGE;
      })
    ),
    { initialValue: DEFAULT_PAGE }
  );

  currentPage = computed(() => this.routePage());
  pageSize = PAGE_SIZE;

  loading = signal(false);
  error = signal<string | null>(null);
  sites = signal<Site[]>([]);
  totalPages = signal(0);
  totalItems = signal(0);
  showCreateForm = signal(false);
  currentPath = signal<string>('/');

  constructor() {
    effect(() => {
      const parentId = this.parentId();
      const page = this.currentPage();
      const pageSize = this.pageSize;

      this.loading.set(true);
      this.error.set(null);

      const subscription = this.siteService.getSites(parentId, page, pageSize).subscribe({
        next: (response) => {
          this.sites.set(response.data);
          this.totalPages.set(response.pagination.totalPages);
          this.totalItems.set(response.pagination.totalItems);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Failed to load sites');
          this.loading.set(false);
        },
      });

      return () => subscription.unsubscribe();
    });

    effect(() => {
      const parentId = this.parentId();
      if (!parentId) {
        this.currentPath.set('/');
        return;
      }

      this.siteService.getSiteById(parentId).subscribe({
        next: (site) => {
          this.currentPath.set(site.path || '/');
        },
        error: () => {
          this.currentPath.set('/');
        },
      });
    });
  }

  onNavigateToSite(site: Site): void {
    if (site.isLeaf) {
      this.siteNavigate.emit(site);
    } else {
      this.router.navigate(['/sites', site.id]);
    }
  }

  onPageChange(page: number): void {
    const clampedPage = Math.max(1, Math.min(page, this.totalPages()));
    const parentId = this.parentId();
    const commands = parentId ? ['/sites', parentId] : ['/sites'];
    const queryParams = clampedPage > DEFAULT_PAGE ? { page: clampedPage } : {};
    this.router.navigate(commands, { queryParams });
  }

  openCreateForm(): void {
    this.showCreateForm.set(true);
  }

  onSiteCreated(site: Site): void {
    const parentId = this.parentId();
    const page = this.currentPage();
    this.siteService.getSites(parentId, page, this.pageSize).subscribe({
      next: (response) => {
        this.sites.set(response.data);
        this.totalPages.set(response.pagination.totalPages);
        this.totalItems.set(response.pagination.totalItems);
      },
    });
  }

  onCreateFormCancelled(): void {
    this.showCreateForm.set(false);
  }
}
