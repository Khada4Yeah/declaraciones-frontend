import { Component, inject, OnInit } from '@angular/core';
import { PersonaNaturalService } from '../../services/persona-natural.service';
import { PersonaJuridicaService } from '../../services/persona-juridica.service';
import { PersonaNatural } from '../../models/persona-natural.model';
import { PersonaJuridica } from '../../models/persona-juridica.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-tarjetas-usuarios',
  templateUrl: './tarjetas-usuarios.component.html',
  styleUrl: './tarjetas-usuarios.component.scss'
})
export class TarjetasUsuariosComponent implements OnInit {
  private personaNaturalService = inject(PersonaNaturalService);
  private personaJuridicaService = inject(PersonaJuridicaService);

  personasNaturales: PersonaNatural[];
  personasJuridicas: PersonaJuridica[];
  diaDeclaracionRuc: { [key: number]: number }[];
  mostrarModal: boolean;
  selectedPersonaNatural: PersonaNatural | null;
  selectedPersonaJuridica: PersonaJuridica | null;
  paginaCargada: boolean;
  colorCache: { [key: string]: string } = {};

  constructor() {
    this.personasNaturales = [];
    this.personasJuridicas = [];
    this.diaDeclaracionRuc = [
      { 1: 10 },
      { 2: 12 },
      { 3: 14 },
      { 4: 16 },
      { 5: 18 },
      { 6: 20 },
      { 7: 22 },
      { 8: 24 },
      { 9: 26 },
      { 0: 28 }
    ];
    this.mostrarModal = false;
    this.paginaCargada = false;
    this.selectedPersonaNatural = null;
    this.selectedPersonaJuridica = null;
  }

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
      error: (error) => {
        console.log('error', error);
      },
      complete: () => {
        this.paginaCargada = true;
      }
    });
  }

  asignarDiaDeclaracion(identificacion: string): number {
    const novenoDigito = parseInt(identificacion.charAt(8), 10);
    //console.log('novenoDigito', novenoDigito);
    const diaDeclaracion = this.diaDeclaracionRuc.find((dia) => dia[novenoDigito]);
    return diaDeclaracion ? diaDeclaracion[novenoDigito] : -1;
  }

  asignarColor(identificacion: string) {
    if (this.colorCache[identificacion]) {
      return this.colorCache[identificacion];
    }

    const diaDeclaracion = this.asignarDiaDeclaracion(identificacion);
    const fechaActual = new Date();
    const diaActual = fechaActual.getDate();

    let color;
    if (diaDeclaracion === diaActual) {
      color = 'red';
    } else if (diaDeclaracion === diaActual + 1 || diaDeclaracion === diaActual + 2) {
      color = '#FFC300';
    } else {
      color = 'green';
    }

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