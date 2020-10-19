import { Injectable } from "@angular/core";
import { LocalStorageService } from "./local-storage.service";
import { Usuario, Lecturista } from "../models/usuario.model";
import { TokenService } from "./token.service";
import { LoginService } from "./login.service";
import { HttpClient } from "@angular/common/http";
import { URL_BASE } from "../../environments/config";
import { catchError, map } from "rxjs/operators";
import { throwError } from "rxjs";
import { NotificacionesService } from "./notificaciones.service";

@Injectable({
  providedIn: "root",
})
export class UsuarioService {
  constructor(
    private notiService: NotificacionesService,
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

    return usuario as Usuario;
  }

  base = URL_BASE("usuario");

  findAll() {
    return this.http.get<Usuario[]>(this.base).pipe(
      catchError((x) => {
        return throwError(x);
      })
    );
  }

  guardarLecturistaEnUsuario(idUsuario: string, idLecturista: string) {
    return this.http
      .put<Usuario>(this.base.concat("/agregarLecturista"), {
        idUsuario,
        idLecturista,
      })
      .pipe(
        map((x) => {
          x.lecturista = x.lecturista as Lecturista;
          return x;
        }),
        catchError((x) => {
          return throwError(x);
        })
      );
  }

  findById(id: string) {
    return this.http.get<Usuario>(this.base.concat(`/leer/${id}`)).pipe(
      catchError((x: any) => {
        this.notiService.toast.error(x.mensaje, x.nombre);

        return throwError(x);
      })
    );
  }
}
