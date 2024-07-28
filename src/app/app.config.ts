import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { provideNzIcons } from './icons-provider';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NzModalModule } from 'ng-zorro-antd/modal';

registerLocaleData(en);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    provideNzIcons(),
    provideNzI18n(en_US),
    importProvidersFrom(FormsModule, NzModalModule),
    provideAnimationsAsync(),
    provideHttpClient(),
  ],
};
