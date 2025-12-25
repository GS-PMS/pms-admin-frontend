import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type Language = 'en' | 'ar';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private translate = inject(TranslateService);
  private readonly STORAGE_KEY = 'app_language';

  constructor() {
    this.initLanguage();
  }

  private initLanguage(): void {
    const savedLang = localStorage.getItem(this.STORAGE_KEY) as Language;
    const defaultLang: Language = savedLang || 'en';

    this.translate.setFallbackLang('en');
    this.setLanguage(defaultLang);
  }

  get currentLang(): Language {
    return this.translate.getCurrentLang() as Language;
  }

  setLanguage(lang: Language): void {
    this.translate.use(lang);
    localStorage.setItem(this.STORAGE_KEY, lang);
    this.updateDocumentDirection(lang);
  }

  toggleLanguage(): void {
    const newLang: Language = this.currentLang === 'en' ? 'ar' : 'en';
    this.setLanguage(newLang);
    console.log(this.currentLang);
  }

  private updateDocumentDirection(lang: Language): void {
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', lang);
  }
}
