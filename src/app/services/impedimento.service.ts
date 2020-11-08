import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { URL_BASE } from "environments/config";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { Offline, IndexedDbService } from "./offline/indexed-db.service";
import { IndexedDBService } from "@codice-progressio/indexed-db";

@Injectable({
  providedIn: "root",
})
export class ImpedimentoService {
  constructor(
    private http: HttpClient,
    private codiceIdbService: IndexedDBService,
    private idbService: IndexedDbService
  ) {}

  base = URL_BASE("impedimento");

  findAll() {
    return this.http
      .get<Impedimento[]>(this.base)
      .pipe(catchError((_) => throwError(_)));
  }

  offline = new Offline(
    this.idbService.storeObjects.IMPEDIMENTOS,
    this.codiceIdbService
  );
}

export interface Impedimento {
  AsignarAuditoria: string;
  IdImpedimento: string;
  NombreImpedimento: string;
}
