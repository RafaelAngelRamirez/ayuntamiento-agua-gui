import { Injectable } from "@angular/core";
import { URL_BASE } from "../../environments/config";
import { HttpClient } from "@angular/common/http";
import { IndexedDbService, Offline } from "./offline/indexed-db.service";
import { IndexedDBService as CodiIDBService } from "@codice-progressio/indexed-db";
import { catchError, map } from "rxjs/operators";
import { throwError } from "rxjs";
import { Lecturista } from "../models/usuario.model";
import {
  IndexedDBService,
  IDBOpcionesObjectStore,
  IDBOpciones,
} from "@codice-progressio/indexed-db";
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

  obtenerPermisos() {
    return this.http.get<any>(this.base.concat("/permisos"));
  }

  obtenerEstadisticasSincronizacion() {
    return this.http.get(this.base.concat("/estado-de-sincronizacion-simapa"));
  }
  archivarContratos() {
    return this.http.put(this.base.concat("/archivar-contratos"), null);
  }

  actualizarPeriodoYVigencia(periodo: number, vigencia: number) {
    return this.http.put(this.base.concat("/vigencia-y-periodo"), {
      periodo,
      vigencia,
    });
  }

  cargarPeriodoVigencia() {
    return this.http.get<{ vigencia: number; periodo: number }>(
      this.base.concat("/vigencia-y-periodo")
    );
  }

  offline = new OfflineParametros(
    this.idbService.storeObjects.PARAMETROS,
    this.codiceIdbService
  );
}

class OfflineParametros extends Offline {
  key = "nombreParametro";

  constructor(
    public storeObject: IDBOpcionesObjectStore,
    public codiIDBService: IndexedDBService
  ) {
    super(storeObject, codiIDBService);
  }

  guardarLecturista(lecturista: Lecturista) {
    return this.codiIDBService.save(
      { [this.key]: "lecturista", lecturista },
      this.storeObject
    );
  }

  obtenerParametrosGenerales() {
    return this.codiIDBService.findById("lecturista", this.storeObject);
  }

  eliminarParametrosTicket() {
    return this.codiIDBService.delete("lecturista", this.storeObject);
  }

  guardarVigenciaYPeriodo(vigPer: { vigencia: number; periodo: number }) {
    return this.codiIDBService.save(
      { [this.key]: "vigenciaPeriodo", vigPer },
      this.storeObject
    );
  }

  eliminarVigenciaYPeriodo() {
    return this.codiIDBService.delete("vigenciaPeriodo", this.storeObject);
  }

  obtenerVigenciaYPeriodo(){
    return this.codiIDBService.findById("vigenciaPeriodo", this.storeObject)
  }
}
