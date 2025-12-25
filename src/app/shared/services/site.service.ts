import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Site } from '../models/site';
import { PaginatedResponse } from '../models/PaginatedResponse';
import { Breadcrumb } from '../models/Breadcrumb';
import { CreateSiteDto } from '../models/CreateSiteDto';
import { CreatePolygonDto } from '../models/CreatePolygonDto';
import { Polygon } from '../models/polygon';
import { environment } from '../../environments/environment';
import { TranslationService } from './translation.service';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 12;

@Injectable({
  providedIn: 'root',
})
export class SiteService {
  private readonly http = inject(HttpClient);
  private readonly translationService = inject(TranslationService);
  private readonly baseUrl = environment.domain;

  private getHeaders() {
    const language = this.translationService.currentLang;
    return { 'Accept-Language': language };
  }

  getSites(
    parentId?: string | null,
    page: number = DEFAULT_PAGE,
    pageSize: number = DEFAULT_PAGE_SIZE
  ): Observable<PaginatedResponse<Site>> {
    let params = new HttpParams()
      .set('parentId', parentId || '')
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PaginatedResponse<Site>>(this.baseUrl, {
      params,
      headers: this.getHeaders(),
    });
  }

  getSiteById(siteId: string): Observable<Site> {
    return this.http.get<Site>(`${this.baseUrl}/${siteId}`, {
      headers: this.getHeaders(),
    });
  }

  getSiteAncestorsIds(siteId: string): Observable<Breadcrumb[]> {
    return this.http.get<Breadcrumb[]>(`${this.baseUrl}/${siteId}/ancestors`, {
      headers: this.getHeaders(),
    });
  }

  createSite(siteData: CreateSiteDto): Observable<Site> {
    return this.http.post<Site>(this.baseUrl, siteData, {
      headers: this.getHeaders(),
    });
  }

  createPolygon(polygonData: CreatePolygonDto): Observable<Polygon> {
    return this.http.post<Polygon>(`${this.baseUrl}/${polygonData.siteId}/polygons`, polygonData, {
      headers: this.getHeaders(),
    });
  }
}
