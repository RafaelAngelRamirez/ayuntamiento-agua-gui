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
          this.notiService.toast.error(x.err)
          return throwError(x);
        })
      );
  }

  findById(id: string) {
    return this.http.get<Usuario>(this.base.concat(`/leer/${id}`)).pipe(
      catchError((x: any) => {
        this.notiService.toast.error(x.mensaje, x.nombre);
        console.log(x);
        return throwError(x);
      })
    );
  }

  update(usuario: Usuario) {
    return this.http
      .put<Usuario>(this.base.concat("/modificar/id/" + usuario._id), usuario)
      .pipe(
        catchError((x: any) => {
          this.notiService.toast.error(x.mensaje, x.nombre);
          return throwError(x);
        })
      );
  }

  save(usuario: Usuario) {
    return this.http.post<Usuario>(this.base, usuario).pipe(
      catchError((x) => {
        console.log(x);
        this.notiService.toast.error(x.err);
        return throwError(x);
      })
    );
  }

  updatePermisos(usuario: Usuario) {
    return this.http
      .put<Usuario>(
        this.base.concat("/modificar/permisos/" + usuario._id),
        usuario.permissions
      )
      .pipe(
        catchError((x: any) => {
          this.notiService.toast.error(x.mensaje, x.nombre);
          return throwError(x);
        })
      );
  }

  updatePassword(id: string, password: string) {
    return this.http
      .put<Usuario>(this.base.concat("/modificar/password/" + id), { password })
      .pipe(
        catchError((x: any) => {

          this.notiService.toast.error(x.error.err);
          return throwError(x);
        })
      );
  }

  updateImpresora(id: string, dispositivo: string) {
    return this.http
      .put<Usuario>(this.base.concat("/modificar/equipos/" + id), {
        dispositivo,
      })
      .pipe(
        catchError((x: any) => {
          this.notiService.toast.error(x.err);
          return throwError(x);
        })
      );
  }
  updateIPhone(id: string, esIphone: boolean) {
    return this.http
      .put<Usuario>(this.base.concat("/modificar/iphone/" + id), {
        esIphone,
      })
      .pipe(
        catchError((x: any) => {
          this.notiService.toast.error(x.err);
          return throwError(x);
        })
      );
  }
}
