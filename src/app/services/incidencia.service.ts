import { Injectable } from "@angular/core";
import { URL_BASE } from "../../environments/config";
import { HttpClient } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { throwError, forkJoin } from "rxjs";
import { Offline, IndexedDbService } from "./offline/indexed-db.service";
import { IndexedDBService } from "@codice-progressio/indexed-db";

@Injectable({
  providedIn: "root",
})
export class IncidenciaService {
  constructor(
    private http: HttpClient,
    private codiceIdbService: IndexedDBService,
    private idbService: IndexedDbService
  ) {}

  base = URL_BASE("incidencia");

  findAll() {
    return this.http
      .get<Incidencia[]>(this.base)
      .pipe(catchError((_) => throwError(_)));
  }

  offline = new Offline(
    this.idbService.storeObjects.INCIDENCIAS,
    this.codiceIdbService
  );
}

export interface Incidencia {
  _id: string;
  IdIncidencia: string;
  NombreIncidencia: string;
}
