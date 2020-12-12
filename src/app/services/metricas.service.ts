import { Injectable } from "@angular/core";
import { URL_BASE } from "../../environments/config";
import { HttpClient } from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class MetricasService {
  base = URL_BASE("metricas");

  constructor(private http: HttpClient) {}

  totalDeContratos() {
    return this.http.get<number>(this.base.concat("/total-de-contratos")).pipe(
      map((resp: any) => resp.totalDeContratos),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  promedioDeTiempo(filtros: string = ""): any {
    return this.http
      .get(this.base.concat("/promedio-tiempo-entre-lecturas").concat(filtros))
      .pipe(
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  dineroRecaudado(filtros: string = ""): any {
    return this.http
      .get(this.base.concat("/dinero-recaudado").concat(filtros))
      .pipe(
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  contratosPendientesTomarLectura(filtros: string = "") {
    return this.http
      .get<ContratosPendientesPorTomarLectura>(
        this.base
          .concat("/contratos-pendientes-por-tomar-lectura")
          .concat(filtros)
      )
      .pipe(
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  lecturasAnormales(filtros: string = "") {
    return this.http
      .get<LecturasAnormales>(
        this.base.concat("/lecturas-anormales").concat(filtros)
      )
      .pipe(
        catchError((err) => {
          return throwError(err);
        })
      );
  }
}

export interface ContratosPendientesPorTomarLectura {
  totalDeContratos: number;
  lecturasTomadas: number;
  pendientesTomarLectura: number;
  rutasPedientesPorTomarLectura: {
    _id: string;
    contratos: string[];
  }[];
  rutasEnElSistema: {
    _id: string;
    total: number;
  }[];
}

export interface LecturasAnormales {
  impedimentos: ImpedimentosIncidencias[];
  incidencias: ImpedimentosIncidencias[];
  fueraDePromedio: FueraDePromedio[];
}

interface ImpedimentosIncidencias {
  _id: "2";
  total: 6;
  detalles: ImpedimentosIncidenciasDetalle[];
}

interface ImpedimentosIncidenciasDetalle {
  Contrato: string;
  Calle: string;
  Colonia: string;
  Poblacion: string;
  Exterior: string;
  Interior: string;
  Contribuyente: string;
  VigenciaAnterior: number;
  PeriodoAnterior: string;
  LecturaAnterior: number;
  Promedio: number;
  SerieMedidor: "string";
  IdRuta: "string";
  lectura: {
    _id: string;
    Contrato: string;
    Vigencia: number;
    Periodo: number;
    IdLecturista: string;
    IdRuta: string;
    IdTarifa: string;
    FechaLectura: string;
    HoraLectura: string;
    LecturaActual: number;
    IdImpedimento: string;
    IdIncidencia: string;
    ConsumoMts3: number;
    Mts3Cobrados: number;
    Observaciones: string;
    IdDispositivo: string;
    Estado: string;
    longitud: number;
    latitud: number;
    importe: number;
    problemas: string;
  };
}

interface FueraDePromedio {
  _id: string;
  detalles: FueraDePromedioDetalle[];
  total: number;
}

interface FueraDePromedioDetalle {
  Contrato: string;
  Promedio: number;
  FechaLectura: Date;
  ConsumoMts3: number;
}
