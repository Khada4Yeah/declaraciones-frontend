import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EncriptacionService } from '../../../../core/services/encriptacion.service';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrl: './editar-usuario.component.scss'
})
export class EditarUsuarioComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private encriptacionService = inject(EncriptacionService);
  tipoPersona: string | null;
  idPersona: number | null;

  constructor() {
    this.tipoPersona = null;
    this.idPersona = null;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.idPersona = Number(this.encriptacionService.desencriptar(id));
      }
      this.tipoPersona = this.route.snapshot.queryParamMap.get('tipoPersona');
    });
  }
}
