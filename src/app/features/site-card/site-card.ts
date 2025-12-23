import { Component, input, output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Site } from '../../shared/models/site';

@Component({
  selector: 'app-site-card',
  imports: [TranslateModule],
  templateUrl: './site-card.html',
  styleUrl: './site-card.scss',
})
export class SiteCard {
  site = input.required<Site>();
  navigate = output<Site>();
  cardIdx = input.required<number>();

  onCardDoubleClick(): void {
    this.navigate.emit(this.site());
  }
}
