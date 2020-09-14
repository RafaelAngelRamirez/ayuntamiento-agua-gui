import { Injectable } from "@angular/core";
import { LocalStorageService } from "./local-storage.service";
import { Usuario } from "../models/usuario.model";
import { TokenService } from "./token.service";
import { LoginService } from "./login.service";
import { HttpClient } from "@angular/common/http";
import { URL_BASE } from "../../environments/config.prod";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UsuarioService {
  constructor(
    private loginService: LoginService,
    private tkService: TokenService,
    private http: HttpClient
  ) {}

  /**
   *Solo lectura. Obtiene desde el localstorage el usuario
   *
   * @returns {Usuario}
   * @memberof UsuarioService
   */
  obtenerUsuario(): Usuario {
    let usuario = this.tkService.obtenerUsuario();

    return  usuario as Usuario
  }

  base = URL_BASE("usuario");

  findAll() {
    return this.http.get<Usuario[]>(this.base).pipe(
      catchError((x) => {
        return throwError(x);
      })
    );
  }
}
