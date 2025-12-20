import { Component, input, output } from '@angular/core';
import { Site } from '../../shared/models/site';

@Component({
  selector: 'app-site-card',
  imports: [],
  templateUrl: './site-card.html',
  styleUrl: './site-card.scss',
})
export class SiteCard {
  site = input.required<Site>();
  navigate = output<Site>();

  onCardDoubleClick(): void {
    this.navigate.emit(this.site());
  }
}
