import { Component, inject, OnInit } from '@angular/core';
import { PersonaNaturalService } from '../../services/persona-natural.service';
import { PersonaJuridicaService } from '../../services/persona-juridica.service';
import { PersonaNatural } from '../../models/persona-natural.model';
import { PersonaJuridica } from '../../models/persona-juridica.model';
import { forkJoin } from 'rxjs';
import { ModalService } from '../../../../core/services/modal.service';

@Component({
  selector: 'app-tarjetas-usuarios',
  templateUrl: './tarjetas-usuarios.component.html',
  styleUrl: './tarjetas-usuarios.component.scss'
})
export class TarjetasUsuariosComponent implements OnInit {
  private personaNaturalService = inject(PersonaNaturalService);
  private personaJuridicaService = inject(PersonaJuridicaService);
  private modalService = inject(ModalService);

  personasNaturales: PersonaNatural[] = [];
  personasJuridicas: PersonaJuridica[] = [];
  diaDeclaracionRuc: Record<number, number> = {
    1: 10, 2: 12, 3: 14, 4: 16, 5: 18,
    6: 20, 7: 22, 8: 24, 9: 26, 0: 28
  };
  mostrarModal = false;
  selectedPersonaNatural: PersonaNatural | null = null;
  selectedPersonaJuridica: PersonaJuridica | null = null;
  paginaCargada = false;
  colorCache: Record<string, string> = {};

  ngOnInit(): void {
    this.obtenerPersonas();
  }

  obtenerPersonas() {
    forkJoin({
      naturales: this.personaNaturalService.obtenerPersonasNaturales(),
      juridicas: this.personaJuridicaService.obtenerPersonasJuridicas()
    }).subscribe({
      next: ({ naturales, juridicas }) => {
        this.personasNaturales = naturales;
        this.personasJuridicas = juridicas;
      },
      error: () => this.modalService.mostrar('error', 'No se pudieron cargar los datos'),
      complete: () => this.paginaCargada = true
    });
  }

  asignarDiaDeclaracion(identificacion: string): number {
    const novenoDigito = parseInt(identificacion.charAt(8), 10);
    return this.diaDeclaracionRuc[novenoDigito] ?? -1;
  }

  asignarColor(identificacion: string): string {
    if (this.colorCache[identificacion]) {
      return this.colorCache[identificacion];
    }

    const diaDeclaracion = this.asignarDiaDeclaracion(identificacion);
    const diaActual = new Date().getDate();

    const color = diaDeclaracion === diaActual ? 'red'
      : diaDeclaracion === diaActual + 1 || diaDeclaracion === diaActual + 2 ? '#FFC300'
        : 'green';

    this.colorCache[identificacion] = color;
    return color;
  }

  mostrarDetalle(personaN: PersonaNatural | null, personaJ: PersonaJuridica | null) {
    this.selectedPersonaNatural = personaN;
    this.selectedPersonaJuridica = personaJ;
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.selectedPersonaNatural = null;
    this.selectedPersonaJuridica = null;
  }

  trackById(index: number, item: PersonaNatural | PersonaJuridica): string {
    return 'identificacion' in item ? item.identificacion : item.ruc;
  }
}