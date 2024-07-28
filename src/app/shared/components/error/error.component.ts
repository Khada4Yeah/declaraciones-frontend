import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { TokenService } from '../../../core/services/token.service';

import { NzResultModule } from 'ng-zorro-antd/result';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [NzResultModule, NzButtonModule],
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss'
})
export class ErrorComponent {
  private tokenService = inject(TokenService);
  private router = inject(Router);

  redirigir() {
    if (this.tokenService.obtenerToken()) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/auth']);
    }
  }

}
