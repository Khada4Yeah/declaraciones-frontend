import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ArchivoService } from '../../services/archivo.service';
import { ModalService } from '../../../../core/services/modal.service';
import { Archivo } from '../../models/archivo.model';

/**
 * Interfaz interna para manejar la selección de archivos en la lista.
 * Extiende Archivo con una propiedad 'checked' para el checkbox.
 */
interface ArchivoSeleccionable extends Archivo {
  checked: boolean;
}

/**
 * Componente modal para visualizar, descargar y eliminar archivos de un usuario.
 * Permite filtrar por año, seleccionar archivos para descarga individual o en ZIP,
 * y eliminar archivos con confirmación.
 */
@Component({
  selector: 'app-modal-ver-archivos',
  templateUrl: './modal-ver-archivos.component.html',
  styleUrls: ['./modal-ver-archivos.component.scss'],
})
export class ModalVerArchivosComponent implements OnChanges {
  @Input() modalVisible: boolean = false;
  @Input() idUsuario: number | null = null;
  @Output() cerrarModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  private archivoService = inject(ArchivoService);
  private modalService = inject(ModalService);

  aniosDisponibles: number[] = [];
  anioSeleccionado: number | null = null;
  archivos: ArchivoSeleccionable[] = [];
  cargando: boolean = false;
  descargando: boolean = false;
  todosSeleccionados: boolean = false;
  indeterminate: boolean = false;

  /**
   * Detecta cambios en las propiedades de entrada.
   * Si el modal se hace visible y hay un usuario, carga los años disponibles.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['modalVisible'] && this.modalVisible && this.idUsuario) {
      this.cargarAniosDisponibles();
    }
  }

  /**
   * Carga los años que tienen archivos para el usuario actual.
   */
  cargarAniosDisponibles(): void {
    if (!this.idUsuario) return;

    this.archivoService.obtenerAniosDisponibles(this.idUsuario).subscribe({
      next: (anios) => {
        this.aniosDisponibles = anios;
        if (anios.length > 0) {
          this.anioSeleccionado = anios[0];
          this.cargarArchivos();
        } else {
          this.archivos = [];
          this.anioSeleccionado = null;
        }
      },
      error: () => {
        this.modalService.mostrar('error', 'No se pudieron cargar los años disponibles');
      }
    });
  }

  /**
   * Carga los archivos del año seleccionado.
   */
  cargarArchivos(): void {
    if (!this.idUsuario || !this.anioSeleccionado) return;

    this.cargando = true;
    this.archivoService.obtenerArchivosPorAnio(this.idUsuario, this.anioSeleccionado).subscribe({
      next: (archivos) => {
        this.archivos = archivos.map(a => ({ ...a, checked: false }));
        this.cargando = false;
        this.actualizarEstadoSeleccion();
      },
      error: () => {
        this.cargando = false;
        this.modalService.mostrar('error', 'No se pudieron cargar los archivos');
      }
    });
  }

  /**
   * Maneja el cambio de año en el selector.
   */
  onAnioChange(): void {
    this.cargarArchivos();
  }

  /**
   * Selecciona o deselecciona todos los archivos de la lista.
   *
   * @param checked Estado del checkbox "Seleccionar todos".
   */
  seleccionarTodos(checked: boolean): void {
    this.archivos.forEach(a => a.checked = checked);
    this.actualizarEstadoSeleccion();
  }

  /**
   * Actualiza el estado de los checkboxes (todos, ninguno, intermedio).
   */
  actualizarEstadoSeleccion(): void {
    const totalSeleccionados = this.archivos.filter(a => a.checked).length;
    this.todosSeleccionados = totalSeleccionados === this.archivos.length && this.archivos.length > 0;
    this.indeterminate = totalSeleccionados > 0 && totalSeleccionados < this.archivos.length;
  }

  /** Retorna la cantidad de archivos seleccionados. */
  get cantidadSeleccionados(): number {
    return this.archivos.filter(a => a.checked).length;
  }

  /**
   * Descarga un archivo individual.
   * Crea un enlace temporal para iniciar la descarga del blob.
   *
   * @param archivo Archivo a descargar.
   */
  descargarIndividual(archivo: Archivo): void {
    this.descargando = true;
    this.archivoService.descargarArchivo(archivo.id_archivo).subscribe({
      next: (blob) => {
        this.iniciarDescarga(blob, archivo.file_name);
        this.descargando = false;
      },
      error: () => {
        this.descargando = false;
        this.modalService.mostrar('error', 'No se pudo descargar el archivo');
      }
    });
  }

  /**
   * Descarga los archivos seleccionados como un ZIP.
   */
  descargarSeleccionados(): void {
    const ids = this.archivos.filter(a => a.checked).map(a => a.id_archivo);
    if (ids.length === 0) return;

    this.descargando = true;
    this.archivoService.descargarZip(ids).subscribe({
      next: (blob) => {
        this.iniciarDescarga(blob, `archivos_${this.anioSeleccionado}.zip`);
        this.descargando = false;
      },
      error: () => {
        this.descargando = false;
        this.modalService.mostrar('error', 'No se pudo generar el archivo ZIP');
      }
    });
  }

  /**
   * Elimina un archivo (soft delete) con confirmación previa.
   *
   * @param archivo Archivo a eliminar.
   */
  eliminarArchivo(archivo: Archivo): void {
    this.archivoService.eliminarArchivo(archivo.id_archivo).subscribe({
      next: () => {
        this.archivos = this.archivos.filter(a => a.id_archivo !== archivo.id_archivo);
        this.actualizarEstadoSeleccion();
        this.modalService.mostrar('success', 'Archivo eliminado correctamente');
      },
      error: () => {
        this.modalService.mostrar('error', 'No se pudo eliminar el archivo');
      }
    });
  }

  /**
   * Formatea el tamaño del archivo a una unidad legible (KB, MB).
   *
   * @param bytes Tamaño en bytes.
   * @returns String con el tamaño formateado.
   */
  formatearTamanio(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  /**
   * Cierra el modal y reinicia el estado interno.
   */
  cerrarModalVer(): void {
    this.archivos = [];
    this.aniosDisponibles = [];
    this.anioSeleccionado = null;
    this.todosSeleccionados = false;
    this.indeterminate = false;
    this.cerrarModal.emit(false);
  }

  /**
   * Inicia la descarga de un blob en el navegador creando un enlace temporal.
   *
   * @param blob Datos binarios del archivo.
   * @param fileName Nombre del archivo para la descarga.
   */
  private iniciarDescarga(blob: Blob, fileName: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
