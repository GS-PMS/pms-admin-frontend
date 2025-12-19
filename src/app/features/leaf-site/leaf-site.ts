import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { Site } from '../../shared/models/site';

@Component({
  selector: 'app-leaf-site',
  imports: [],
  templateUrl: './leaf-site.html',
  styleUrl: './leaf-site.scss',
})
export class LeafSite {
  site = input.required<Site>();
}
