import { Component, computed, input } from '@angular/core';
import { Site } from '../../shared/models/site';

@Component({
  selector: 'app-site-card',
  imports: [],
  templateUrl: './site-card.html',
  styleUrl: './site-card.scss',
})
export class SiteCard {
  site = input.required<Site>();

  get subsiteCount(): number {
    return this.site().children?.length || 0;
  }

  onCardDoubleClick(): void {
    console.log("should move into the site");
  }
}
