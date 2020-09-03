import { Injectable } from "@angular/core";
import { URL_BASE } from "../../environments/config.prod";
import { HttpClient } from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ContratoService {
  constructor(private http: HttpClient) {}

  base = URL_BASE("contrato");
  contratos: Contrato[] = [];

  findAll() {
    return this.http.get<Contrato[]>(this.base.concat("/leer/todo")).pipe(
      map(contratos => contratos),
      catchError((x) => throwError(x))
    );
  }

  findByTerm(termino: string) {
    let termi = encodeURI(termino);
    return this.http
      .get<Contrato[]>(this.base.concat("/leer/termino/").concat(termi))
      .pipe(catchError((x) => throwError(x)));
  }

  findContrato(contrato: string) {
    return this.http
      .get<Contrato>(this.base.concat("/leer/contrato/").concat(contrato))
      .pipe(catchError((x) => throwError(x)));
  }
}

export interface Contrato {
  Contrato: string;
  Calle: string;
  Colonia: string;
  Poblacion: string;
  Exterior: string;
  Contribuyente: string;
  VigenciaAnterior: number;
  PeriodoAnterior: string;
  LecturaAnterior: number;
  Promedio: number;
  SerieMedidor: string;
  IdTarifa: string;
  IdRuta: string;
  Saldo: number;
  Adeudo: number;
  TipoPeriodo: string;
  // No entiendo que hace consecutivoRuta ni para que es en auditoria
  ConsecutivoRuta: number;
  EnAuditoria: boolean;

  // Este cambia el schema
  // lecturas: [Lectura];
  tomada: boolean;
  sincronizada: boolean;
  lectura:{}
}


