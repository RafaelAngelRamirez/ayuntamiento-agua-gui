import { Injectable } from "@angular/core";
import { LocalStorageService } from "./local-storage.service";
import { Usuario } from "../models/usuario.model";
import { TokenService } from "./token.service";
import { LoginService } from "./login.service";

@Injectable({
  providedIn: "root",
})
export class UsuarioService {
  constructor(
    private loginService: LoginService,
    private tkService: TokenService
  ) {}

  /**
   *Solo lectura. Obtiene desde el localstorage el usuario
   *
   * @returns {Usuario}
   * @memberof UsuarioService
   */
  obtenerUsuario(): Usuario {
    let usuario = this.tkService.obtenerUsuario();

    throw usuario;
  }
}
