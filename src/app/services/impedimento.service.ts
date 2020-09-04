import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { URL_BASE } from "environments/config.prod";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ImpedimentoService {
  constructor(private http: HttpClient) {}

  base = URL_BASE("impedimento");

  findAll() {
    return this.http
      .get<Impedimento[]>(this.base)
      .pipe(catchError((_) => throwError(_)));
  }
}

export interface Impedimento {
  AsignarAuditoria: String;
  IdImpedimento: String;
  NombreImpedimento: String;
}
