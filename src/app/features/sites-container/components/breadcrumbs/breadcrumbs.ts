import { Component, input, output } from '@angular/core';
import { Breadcrumb } from '../../../../shared/models/Breadcrumb';

@Component({
  selector: 'app-breadcrumbs',
  imports: [],
  templateUrl: './breadcrumbs.html',
  styleUrl: './breadcrumbs.scss',
})
export class Breadcrumbs {
  breadcrumbs = input.required<Breadcrumb[]>();
  currentSiteId = input<string | null>(null);
  breadcrumbClick = output<Breadcrumb>();

  onBreadcrumbClick(crumb: Breadcrumb): void {
    this.breadcrumbClick.emit(crumb);
  }
}

