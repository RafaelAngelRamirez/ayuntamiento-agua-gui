import { Injectable } from "@angular/core";
import { URL_BASE } from "../../environments/config";
import { HttpClient } from "@angular/common/http";
import { IndexedDbService, Offline } from "./offline/indexed-db.service";
import { IndexedDBService as CodiIDBService } from "@codice-progressio/indexed-db";
import { catchError, map } from "rxjs/operators";
import { throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ParametrosService {
  base = URL_BASE("parametros");

  constructor(
    private http: HttpClient,
    private idbService: IndexedDbService,
    private codiceIdbService: CodiIDBService
  ) {}

  actualizarPermisosSuperUsuario() {
    return this.http.put(this.base.concat("/actualizar-permisos"), null);
  }

  obtenerUsuariosSimapa() {
    return this.http.get<any[]>(this.base.concat("/lecturistas"));
  }

  obtenerVigenciaActual() {
    return this.http
      .get<number>(this.base.concat("/vigenciaActual"))

      .pipe(
        map((datos: any) => {
          return datos.vigenciaActual as number;
        }),
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  guardarVigenciaActual(vigenciaActual: number | undefined) {
    return this.http
      .put<number>(this.base.concat("/vigenciaActual"), {
        vigenciaActual,
      })
      .pipe(
        map((datos: any) => {
          return datos.vigenciaActual as number;
        }),
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  obtenerPeriodoActual() {
    return this.http.get<number>(this.base.concat("/periodoActual")).pipe(
      map((datos: any) => {
        return datos.periodoActual as number;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  guardarPeriodoActual(periodoActual: number) {
    return this.http
      .put<number>(this.base.concat("/periodoActual"), {
        periodoActual,
      })
      .pipe(
        map((datos: any) => {
          return datos.periodoActual as number;
        }),
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  offline = new OfflineParametros(
    this.idbService.storeObjects.PARAMETROS,
    this.codiceIdbService
  );
}

class OfflineParametros extends Offline {
  obtenerVigenciaActual() {
    throw "No definido";
  }
  obtenerPeridoActual() {
    throw "No definido";
  }
}
