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
        console.log('personasNaturales', this.personasNaturales);
        console.log('personasJuridicas', this.personasJuridicas);


      },
      error: (error) => {
        console.log('error', error);
      }
    });
  }

  asignarDiaDeclaracion(identificacion: string): number {
    const novenoDigito = parseInt(identificacion.charAt(9), 10);
    const diaDeclaracion = this.diaDeclaracionRuc.find((dia) => dia[novenoDigito]);
    return diaDeclaracion ? diaDeclaracion[novenoDigito] : -1;
  }

  asignarColor(identificacion: string) {
    const diaDeclaracion = this.asignarDiaDeclaracion(identificacion);
    // Obtener el dia actual
    const fechaActual = new Date();
    const diaActual = fechaActual.getDate();
    console.log('diaActual' + diaActual);
    console.log('diaDeclaracion' + diaDeclaracion);
    // Si el dia de declaración es igual al dia actual, el color es rojo
    if (diaDeclaracion === diaActual) {
      return 'red';
    }
    // Si el dia de declaracion esta proximo por uno o dos dias, el color es amarillo
    if (diaDeclaracion === diaActual + 1 || diaDeclaracion === diaActual + 2) {
      return 'yellow';
    }
    return 'green';
  }


}
