import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ArchivoService } from '../../services/archivo.service';
import { ModalService } from '../../../../core/services/modal.service';
import { NzUploadFile } from 'ng-zorro-antd/upload';

/**
 * Componente modal para subir archivos a un usuario.
 * Permite seleccionar el año (carpeta) y subir múltiples archivos
 * mediante drag & drop o selección manual.
 */
@Component({
  selector: 'app-modal-subir-archivos',
  templateUrl: './modal-subir-archivos.component.html',
  styleUrls: ['./modal-subir-archivos.component.scss'],
})
export class ModalSubirArchivosComponent {
  @Input() modalVisible: boolean = false;
  @Input() idUsuario: number | null = null;
  @Output() cerrarModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() archivosSubidos: EventEmitter<void> = new EventEmitter<void>();

  private archivoService = inject(ArchivoService);
  private modalService = inject(ModalService);

  anioSeleccionado: number = new Date().getFullYear();
  archivosParaSubir: NzUploadFile[] = [];
  subiendo: boolean = false;

  /** Genera la lista de años disponibles para seleccionar (2020 hasta año actual + 1) */
  get aniosDisponibles(): number[] {
    const anioActual = new Date().getFullYear();
    const anios: number[] = [];
    for (let i = anioActual + 1; i >= 2020; i--) {
      anios.push(i);
    }
    return anios;
  }

  /**
   * Intercepta la subida para manejarla manualmente.
   * Retorna false para evitar la subida automática de nz-upload.
   *
   * @param file Archivo seleccionado.
   * @returns false para prevenir subida automática.
   */
  antesDeSubir = (file: NzUploadFile): boolean => {
    this.archivosParaSubir = [...this.archivosParaSubir, file];
    return false;
  };

  /**
   * Elimina un archivo de la lista de archivos pendientes.
   *
   * @param file Archivo a remover.
   */
  removerArchivo(file: NzUploadFile): void {
    this.archivosParaSubir = this.archivosParaSubir.filter(f => f.uid !== file.uid);
  }

  /**
   * Sube los archivos seleccionados al backend.
   * Muestra feedback de éxito o error al usuario.
   */
  subirArchivos(): void {
    if (!this.idUsuario || this.archivosParaSubir.length === 0) {
      this.modalService.mostrar('warning', 'Seleccione al menos un archivo para subir');
      return;
    }

    this.subiendo = true;
    const files: File[] = this.archivosParaSubir.map(f => f as unknown as File);

    this.archivoService.subirArchivos(this.idUsuario, this.anioSeleccionado, files).subscribe({
      next: () => {
        this.subiendo = false;
        this.archivosParaSubir = [];
        this.archivosSubidos.emit();
        this.cerrarModalSubir();
        this.modalService.mostrar('success', 'Archivos subidos exitosamente');
      },
      error: (error) => {
        this.subiendo = false;
        this.modalService.mostrarErrorHttp(error);
      }
    });
  }

  /**
   * Cierra el modal y limpia la lista de archivos pendientes.
   */
  cerrarModalSubir(): void {
    this.archivosParaSubir = [];
    this.cerrarModal.emit(false);
  }
}
