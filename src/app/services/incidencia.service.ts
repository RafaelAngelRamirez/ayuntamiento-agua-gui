import { Injectable } from "@angular/core";
import { URL_BASE } from "../../environments/config.prod";
import { HttpClient } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class IncidenciaService {
  constructor(private http: HttpClient) {}

  base = URL_BASE("incidencia");

  findAll() {
    return this.http
      .get<Incidencia[]>(this.base)
      .pipe(catchError((_) => throwError(_)));
  }
}

export interface Incidencia {
  IdIncidencia: String;
  NombreIncidencia: String;
}
