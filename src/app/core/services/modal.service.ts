import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { NzModalService, NzModalRef } from 'ng-zorro-antd/modal';

import { RespuestaError } from '../models/respuesta-error.model';

/**
 * Servicio centralizado para mostrar modales de feedback al usuario.
 * Utiliza NG-Zorro NzModalService para mostrar diálogos de éxito, error,
 * información y advertencia.
 */
@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private router = inject(Router);
  private modalService = inject(NzModalService);

  /**
   * Muestra un modal con el tipo y mensaje especificados.
   * Opcionalmente redirige a una ruta o recarga la página al cerrar.
   *
   * @param tipo Tipo de modal: 'error', 'success', 'info' o 'warning'.
   * @param mensaje Mensaje a mostrar en el cuerpo del modal.
   * @param ruta Ruta opcional para navegar al cerrar el modal (solo en success).
   * @param recargar Si es true, recarga la página al cerrar el modal (solo en success).
   */
  mostrar(tipo: 'error' | 'success' | 'info' | 'warning', mensaje: string, ruta?: string, recargar?: boolean): void {
    let modal: NzModalRef;
    switch (tipo) {
      case 'error':
        modal = this.modalService.error({
          nzTitle: 'Error',
          nzContent: mensaje.replace(/\n/g, '<br>'),
          nzStyle: { whiteSpace: 'pre-line' }
        });
        break;
      case 'success':
        modal = this.modalService.success({
          nzTitle: 'Éxito',
          nzContent: mensaje.replace(/\n/g, '<br>'),
          nzStyle: { whiteSpace: 'pre-line' }
        });
        if (ruta) {
          modal.afterClose.subscribe(() => {
            this.router.navigate([ruta]);
          });
        }
        if (recargar) {
          modal.afterClose.subscribe(() => {
            window.location.reload();
          });
        }
        break;
      case 'info':
        modal = this.modalService.info({
          nzTitle: 'Información',
          nzContent: mensaje.replace(/\n/g, '<br>'),
          nzStyle: { whiteSpace: 'pre-line' }
        });
        break;
      case 'warning':
        modal = this.modalService.warning({
          nzTitle: 'Advertencia',
          nzContent: mensaje.replace(/\n/g, '<br>'),
          nzStyle: { whiteSpace: 'pre-line' }
        });
        break;
      default:
        throw new Error(`Tipo de modal no soportado: ${tipo}`);
    }
  }

  /**
   * Muestra un modal de error HTTP, formateando automáticamente los errores
   * de validación del backend.
   *
   * @param error Objeto HttpErrorResponse del error HTTP capturado.
   */
  mostrarErrorHttp(error: HttpErrorResponse): void {
    const respuestaError = error.error as RespuestaError;
    const mensaje = this.formateoErrores(respuestaError);
    this.mostrar('error', mensaje);
  }

  /**
   * Formatea los errores de validación del backend en un string legible.
   * Combina el mensaje principal con los mensajes de cada campo con error.
   *
   * @param error Objeto con el mensaje y los errores de validación.
   * @returns String formateado con todos los mensajes de error.
   */
  public formateoErrores(error: RespuestaError): string {
    let result = error.message + '\n';

    if (error.errors !== null && error.errors !== undefined) {
      Object.keys(error.errors).forEach((key: string) => {
        error.errors![key].forEach((msg: string) => {
          result += `${msg}\n`;
        });
      });
    }
    return result;
  }
}