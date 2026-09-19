import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 * Página de edición de usuario.
 * Determina el tipo de persona y carga el formulario correspondiente.
 */
@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrl: './editar-usuario.component.scss'
})
export class EditarUsuarioComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  tipoPersona: string | null = null;
  idPersona: number | null = null;

  /**
   * Obtiene el ID y tipo de persona de los parámetros de la URL.
   * Usa el ID directo sin necesidad de desencriptación.
   */
  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.idPersona = Number(id);
        }
        this.tipoPersona = this.route.snapshot.queryParamMap.get('tipoPersona');
      });
  }
}
