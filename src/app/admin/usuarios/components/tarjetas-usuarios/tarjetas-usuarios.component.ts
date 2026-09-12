// tarjetas-usuarios.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { PersonaNaturalService } from '../../services/persona-natural.service';
import { PersonaJuridicaService } from '../../services/persona-juridica.service';
import { PersonaNatural } from '../../models/persona-natural.model';
import { PersonaJuridica } from '../../models/persona-juridica.model';
import { forkJoin } from 'rxjs';
import { ModalService } from '../../../../core/services/modal.service';

export interface ClienteItem {
  id: number;
  tipo: 'natural' | 'juridica';
  tipoEtiqueta: string;
  identificacion: string;
  nombre: string;
  correo: string;
  celular: string;
  diaDeclaracion: number;
  estadoDeclaracion: 'hoy' | 'proximo' | 'al-dia';
  estadoColor: string;
  estadoTexto: string;
  iniciales: string;
  personaNatural?: PersonaNatural;
  personaJuridica?: PersonaJuridica;
}

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
  todosLosClientes: ClienteItem[] = [];

  diaDeclaracionRuc: Record<number, number> = {
    1: 10, 2: 12, 3: 14, 4: 16, 5: 18,
    6: 20, 7: 22, 8: 24, 9: 26, 0: 28
  };

  mostrarModal = false;
  selectedPersonaNatural: PersonaNatural | null = null;
  selectedPersonaJuridica: PersonaJuridica | null = null;
  paginaCargada = false;

  // Filtros y Búsqueda
  terminoBusqueda: string = '';
  filtroTipo: 'todos' | 'natural' | 'juridica' | 'proximos' = 'todos';
  ordenamiento: 'nombre-asc' | 'nombre-desc' | 'dia-asc' = 'nombre-asc';

  // Paginación
  paginaActual: number = 1;
  tamanioPagina: number = 12;
  tamanioOpciones: number[] = [12, 24, 48];

  ngOnInit(): void {
    this.obtenerPersonas();
  }

  obtenerPersonas(): void {
    this.paginaCargada = false;
    forkJoin({
      naturales: this.personaNaturalService.obtenerPersonasNaturales(),
      juridicas: this.personaJuridicaService.obtenerPersonasJuridicas()
    }).subscribe({
      next: ({ naturales, juridicas }) => {
        this.personasNaturales = naturales;
        this.personasJuridicas = juridicas;
        this.construirClientesUnificados();
      },
      complete: () => this.paginaCargada = true
    });
  }

  asignarDiaDeclaracion(identificacion: string): number {
    if (!identificacion || identificacion.length < 9) return 28;
    const novenoDigito = parseInt(identificacion.charAt(8), 10);
    return this.diaDeclaracionRuc[novenoDigito] ?? 28;
  }

  calcularEstadoDeclaracion(diaDeclaracion: number): {
    estado: 'hoy' | 'proximo' | 'al-dia';
    color: string;
    texto: string;
  } {
    const diaActual = new Date().getDate();
    if (diaDeclaracion === diaActual) {
      return { estado: 'hoy', color: '#ef4444', texto: '¡Vence Hoy!' };
    }
    if (diaDeclaracion === diaActual + 1) {
      return { estado: 'proximo', color: '#f59e0b', texto: 'Vence Mañana' };
    }
    if (diaDeclaracion === diaActual + 2) {
      return { estado: 'proximo', color: '#f59e0b', texto: 'Vence en 2 días' };
    }
    return { estado: 'al-dia', color: '#10b981', texto: `Día ${diaDeclaracion}` };
  }

  private obtenerIniciales(nombre: string): string {
    if (!nombre) return 'CL';
    const partes = nombre.trim().split(/\s+/);
    if (partes.length >= 2) {
      return (partes[0].charAt(0) + partes[1].charAt(0)).toUpperCase();
    }
    return nombre.substring(0, 2).toUpperCase();
  }

  construirClientesUnificados(): void {
    const clientes: ClienteItem[] = [];

    // Mapear Personas Naturales
    for (const p of this.personasNaturales) {
      const nombreCompleto = [p.nombres, p.apellido_p, p.apellido_m].filter(Boolean).join(' ');
      const dia = this.asignarDiaDeclaracion(p.identificacion);
      const estado = this.calcularEstadoDeclaracion(dia);
      const tieneRuc = p.identificacion.length === 13 && p.identificacion.endsWith('001');

      clientes.push({
        id: p.id_persona_natural,
        tipo: 'natural',
        tipoEtiqueta: tieneRuc ? 'Natural (RUC)' : 'Natural (Cédula)',
        identificacion: p.identificacion,
        nombre: nombreCompleto,
        correo: p.usuario?.correo_electronico || '',
        celular: p.usuario?.celular || '',
        diaDeclaracion: dia,
        estadoDeclaracion: estado.estado,
        estadoColor: estado.color,
        estadoTexto: estado.texto,
        iniciales: this.obtenerIniciales(nombreCompleto),
        personaNatural: p
      });
    }

    // Mapear Personas Jurídicas
    for (const p of this.personasJuridicas) {
      const dia = this.asignarDiaDeclaracion(p.ruc);
      const estado = this.calcularEstadoDeclaracion(dia);

      clientes.push({
        id: p.id_persona_juridica,
        tipo: 'juridica',
        tipoEtiqueta: 'Jurídica',
        identificacion: p.ruc,
        nombre: p.razon_social,
        correo: p.usuario?.correo_electronico || '',
        celular: p.usuario?.celular || '',
        diaDeclaracion: dia,
        estadoDeclaracion: estado.estado,
        estadoColor: estado.color,
        estadoTexto: estado.texto,
        iniciales: this.obtenerIniciales(p.razon_social),
        personaJuridica: p
      });
    }

    this.todosLosClientes = clientes;
  }

  // Métricas y KPIs
  get totalClientes(): number {
    return this.todosLosClientes.length;
  }

  get totalNaturales(): number {
    return this.personasNaturales.length;
  }

  get totalJuridicas(): number {
    return this.personasJuridicas.length;
  }

  get totalProximos(): number {
    return this.todosLosClientes.filter(
      c => c.estadoDeclaracion === 'hoy' || c.estadoDeclaracion === 'proximo'
    ).length;
  }

  // Filtrado y Búsqueda
  get clientesFiltrados(): ClienteItem[] {
    let lista = [...this.todosLosClientes];

    // Filtro por pestaña
    if (this.filtroTipo === 'natural') {
      lista = lista.filter(c => c.tipo === 'natural');
    } else if (this.filtroTipo === 'juridica') {
      lista = lista.filter(c => c.tipo === 'juridica');
    } else if (this.filtroTipo === 'proximos') {
      lista = lista.filter(c => c.estadoDeclaracion === 'hoy' || c.estadoDeclaracion === 'proximo');
    }

    // Filtro por búsqueda de texto
    if (this.terminoBusqueda && this.terminoBusqueda.trim()) {
      const q = this.normalizarTexto(this.terminoBusqueda.trim());
      lista = lista.filter(c =>
        this.normalizarTexto(c.nombre).includes(q) ||
        c.identificacion.includes(q) ||
        this.normalizarTexto(c.correo).includes(q) ||
        c.celular.includes(q)
      );
    }

    // Ordenamiento
    if (this.ordenamiento === 'nombre-asc') {
      lista.sort((a, b) => a.nombre.localeCompare(b.nombre));
    } else if (this.ordenamiento === 'nombre-desc') {
      lista.sort((a, b) => b.nombre.localeCompare(a.nombre));
    } else if (this.ordenamiento === 'dia-asc') {
      lista.sort((a, b) => a.diaDeclaracion - b.diaDeclaracion);
    }

    return lista;
  }

  get clientesPaginados(): ClienteItem[] {
    const inicio = (this.paginaActual - 1) * this.tamanioPagina;
    return this.clientesFiltrados.slice(inicio, inicio + this.tamanioPagina);
  }

  onBusquedaChange(): void {
    this.paginaActual = 1;
  }

  setFiltroTipo(tipo: 'todos' | 'natural' | 'juridica' | 'proximos'): void {
    this.filtroTipo = tipo;
    this.paginaActual = 1;
  }

  limpiarFiltros(): void {
    this.terminoBusqueda = '';
    this.filtroTipo = 'todos';
    this.ordenamiento = 'nombre-asc';
    this.paginaActual = 1;
  }

  private normalizarTexto(str: string): string {
    return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  // Modal de Detalle
  abrirModalCliente(cliente: ClienteItem): void {
    if (cliente.tipo === 'natural') {
      this.mostrarDetalle(cliente.personaNatural || null, null);
    } else {
      this.mostrarDetalle(null, cliente.personaJuridica || null);
    }
  }

  mostrarDetalle(personaN: PersonaNatural | null, personaJ: PersonaJuridica | null): void {
    this.selectedPersonaNatural = personaN;
    this.selectedPersonaJuridica = personaJ;
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.selectedPersonaNatural = null;
    this.selectedPersonaJuridica = null;
  }

  trackById(index: number, item: ClienteItem): number {
    return item.id;
  }
}