import { Injectable } from "@angular/core";
import { LocalStorageService } from "./local-storage.service";
import { Usuario } from "../models/usuario.model";
import { TokenService } from "./token.service";

@Injectable({
  providedIn: "root",
})
export class UsuarioService {
  constructor(private tkService: TokenService) {}

  /**
   *Solo lectura. Obtiene desde el localstorage el usuario
   *
   * @returns {Usuario}
   * @memberof UsuarioService
   */
  obtenerUsuario(): Usuario {
    return this.tkService.obtenerUsuario();
  }
}
