import { Component, computed, input, output } from '@angular/core';

const ELLIPSIS_MARKER = -1;
const MAX_VISIBLE_PAGES = 7;

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
})
export class Pagination {
  currentPage = input.required<number>();
  pageSize = input.required<number>();
  totalPages = input.required<number>();
  totalItems = input.required<number>();
  pageChange = output<number>();

  startItem = computed(() => (this.currentPage() - 1) * this.pageSize() + 1);

  endItem = computed(() => Math.min(this.currentPage() * this.pageSize(), this.totalItems()));

  pageNumbers = computed(() => this.getPageNumbers());

  onPageChange(page: number): void {
    this.pageChange.emit(page);
  }

  private getPageNumbers(): number[] {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];

    if (total <= MAX_VISIBLE_PAGES) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      // add ellipsis (...) if current page is far from start
      if (current > 3) {
        pages.push(ELLIPSIS_MARKER);
      }

      // show pages around current page
      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // add ellipsis (...) if current page is far from end
      if (current < total - 2) {
        pages.push(ELLIPSIS_MARKER);
      }

      pages.push(total);
    }

    return pages;
  }
}