import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationService } from '../../shared/services/translation.service';

@Component({
  selector: 'app-header',
  imports: [TranslateModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private translationService = inject(TranslationService);
  private router = inject(Router);

  goHome(): void {
    this.router.navigate(['/']);
  }

  toggleLanguage(): void {
    this.translationService.toggleLanguage();
  }
}
