import { Injectable } from "@angular/core";
import {
  IndexedDBService,
  IDBOpcionesObjectStore,
  IDBOpciones,
} from "@codice-progressio/indexed-db";

@Injectable({
  providedIn: "root",
})
export class IndexedDbService {
  storeObjects = {
    CONTRATOS: new IDBOpcionesObjectStore("contratos", "Contrato"),
    PARAMETROS: new IDBOpcionesObjectStore("parametros", "nombreParametro"),
    INCIDENCIAS: new IDBOpcionesObjectStore("incidencias", "_id"),
    IMPEDIMENTOS: new IDBOpcionesObjectStore("impedimentos", "_id"),
  };

  opciones: IDBOpciones = new IDBOpciones("SIMAPA");

  constructor(private idbService: IndexedDBService) {}

  inicializar() {
    return this.idbService.inicializar(
      this.opciones,
      Object.values(this.storeObjects)
    );
  }
}

export class Offline {
  constructor(
    public storeObject: IDBOpcionesObjectStore,
    public codiIDBService: IndexedDBService
  ) {}

  findAll() {
    return this.codiIDBService.findAll(this.storeObject);
  }

  update(data: any) {
    return this.codiIDBService.update(data, this.storeObject);
  }

  findById(id: string) {
    return this.codiIDBService.findById(id, this.storeObject);
  }

  save(data: any) {
    return this.codiIDBService.save(data, this.storeObject);
  }

  deleteAll() {
    return this.codiIDBService.deleteAll(this.storeObject);
  }
}
