import { Injectable } from "@angular/core";
import { URL_BASE } from "../../environments/config.prod";
import { HttpClient } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ContratoService {
  constructor(private http: HttpClient) {}

  base = URL_BASE("contrato");

  findAll() {
    return this.http
      .get<Contrato[]>(this.base.concat("/leer/todo"))
      .pipe(catchError((x) => throwError(x)));
  }
}

export interface Contrato {
  contrato: string;
  calle: string;
  colonia: string;
  poblacion: string;
  exterior: string;
  contribuyente: string;
  vigenciaAnterior: number;
  periodoAnterior: string;
  lecturaAnterior: number;
  promedio: number;
  serieMedidor: string;
  idTarifa: string;
  idRuta: string;
  saldo: number;
  adeudo: number;
  tipoPeriodo: string;
  // No entiendo que hace consecutivoRuta ni para que es en auditoria
  consecutivoRuta: number;
  enAuditoria: Boolean;

  // Este cambia el schema
  // lecturas: [Lectura];
}
