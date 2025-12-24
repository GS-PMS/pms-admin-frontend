import { Component, input, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Site } from '../../shared/models/site';
import { Polygon } from '../../shared/models/polygon';
import { PolygonList } from './components/polygon-list/polygon-list';

@Component({
  selector: 'app-leaf-site',
  imports: [PolygonList, TranslateModule],
  templateUrl: './leaf-site.html',
  styleUrl: './leaf-site.scss',
})
export class LeafSite {
  site = input.required<Site>();
  polygons = signal<Polygon[]>([]);

  ngOnInit(): void {
    this.polygons.set(this.site().polygons || []);
  }

  onPolygonAdded(polygon: Polygon): void {
    this.polygons.update((current) => [...current, polygon]);
  }
}
