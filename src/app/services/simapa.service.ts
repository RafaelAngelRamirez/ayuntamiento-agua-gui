import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { URL_BASE } from "../../environments/config";
import { catchError, map } from "rxjs/operators";
import { throwError, forkJoin } from "rxjs";
import { Contrato, ContratoService } from "./contrato.service";
import { IndexedDBService } from "@codice-progressio/indexed-db";
import { NotificacionesService } from "./notificaciones.service";

@Injectable({
  providedIn: "root",
})
export class SimapaService {
  base = URL_BASE("simapa");

  constructor(
    private notiService: NotificacionesService,
    private http: HttpClient,
    private contratoService: ContratoService,
    private idbService: IndexedDBService
  ) {}

  error = (x: any) => {
    this.notiService.error("500", x.nombre, x.error.err);
    return throwError(x);
  };

  subirLectura(lectura: any) {
    return this.http
      .put(URL_BASE("simapa/guardar/lectura"), lectura)
      .pipe(catchError((_) => throwError(_)));
  }

  /**
   *Sincroniza los datos desde simapa sql server. Es necesario primero
   * sinronizar los parametros para obtener los lecturistas.
   *
   * @returns
   * @memberof SimapaService
   */
  sincronizarContratos() {
    return this.http
      .put<Contrato[]>(this.base.concat("/sincronizar/contratos"), null)
      .pipe(catchError((x) => throwError(x)));
  }

  /**
   *Sincroniza todos los parametros desde simapa sql server.
   * Incidencias
   * lecturistas
   * Tarifas
   * Vigencias
   * Periodos
   *
   *
   * @returns
   * @memberof SimapaService
   */
  sincronizarParametros() {
    return this.http
      .put<any>(this.base.concat("/sincronizar/parametros"), null)
      .pipe(catchError(this.error));
  }

  subirLecturasASimapa() {
    return this.http
      .put(this.base.concat("/guardar/lecturas/listas"), null)
      .pipe(catchError(this.error));
  }
}
