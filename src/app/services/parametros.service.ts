import { Injectable } from "@angular/core";
import { URL_BASE } from "../../environments/config";
import { HttpClient } from "@angular/common/http";
import { IndexedDbService, Offline } from "./offline/indexed-db.service";
import { IndexedDBService as CodiIDBService } from "@codice-progressio/indexed-db";
import { catchError, map } from "rxjs/operators";
import { throwError } from "rxjs";
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
  obtenerVigenciaActual() {
    return this.codiIDBService.findAll(this.storeObject);
  }
  guardarVigenciaActual(vigencia: number) {
    return this.codiIDBService.save(
      { [this.key]: "vigencia", vigencia },
      this.storeObject
    );
  }
  obtenerPeridoActual() {
    throw "No definido";
  }
}
