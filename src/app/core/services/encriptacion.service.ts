import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncriptacionService {

  constructor() { }

  private secretKey = 'A@v3ry$3cr3tK3y';

  encriptar(value: string): string {
    const encrypted = CryptoJS.AES.encrypt(value, this.secretKey).toString();
    return encodeURIComponent(encrypted);
  }

  desencriptar(encryptedValue: string): string {
    const decodedValue = decodeURIComponent(encryptedValue);
    const bytes = CryptoJS.AES.decrypt(decodedValue, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
