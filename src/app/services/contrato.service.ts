import { Injectable } from "@angular/core";
import { URL_BASE } from "../../environments/config.prod";
import { HttpClient } from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { throwError, Observable, forkJoin } from "rxjs";
import { EstatusConexionService } from "@codice-progressio/estatus-conexion";
import { NotificacionesService } from "./notificaciones.service";
import { IndexedDBService } from "@codice-progressio/indexed-db";

@Injectable({
  providedIn: "root",
})
export class ContratoService {
  estaOnline = false;
  constructor(
    private notiService: NotificacionesService,
    private http: HttpClient,
    private estatus: EstatusConexionService,
    private idbService: IndexedDBService
  ) {
    this.estatus.online.subscribe((estaOnline) => {
      console.log("estaOnline", estaOnline);
      if (estaOnline) this.sincronizarContratosTomadosOffline();
      this.estaOnline = estaOnline;

      if (!estaOnline) {
        this.notiService.toast.warning("Sin conexion");
      }
    });
  }

  base = URL_BASE("contrato");
  contratos: Contrato[] = [];

  findAll() {
    return this.http.get<Contrato[]>(this.base.concat("/leer/todo")).pipe(
      map((contratos) => {
        this.contratos = contratos;
        return contratos;
      }),
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

  update(contrato: Contrato) {
    let url = this.base.concat("/agregar/lectura");
    return this.http.put<null>(url, contrato);
  }

  sincronizarContratosTomadosOffline(): Observable<number> {
    return new Observable((subscriber) => {
      let paraSincronizar = this.contratosPorSubir();

      if (paraSincronizar.length > 0) {
        let observables: Observable<any>[] = [];

        paraSincronizar.forEach((c) => {
          c.sincronizada = true;
          observables.push(this.update(c));
          //Actualizamos el contrato en indexed-db
          observables.push(this.idbService.update(c));
        });

        console.log(`paraSincronizar.length`, paraSincronizar.length);
        forkJoin(observables).subscribe(
          (Parametros) => {
            subscriber.next(paraSincronizar.length);
            return subscriber.complete();
          },
          (_) => subscriber.error(_)
        );
      } else {
        this.notiService.toast.info(
          "[ En linea ]: No hay contratos para subir a la nube"
        );
        subscriber.next(0);
        subscriber.complete();
      }
    });
  }

  construirBusqueda(contrato: Contrato): string {
    return `${contrato.Calle} ${contrato.Exterior} ${contrato.Colonia} ${contrato.Poblacion} ${contrato.Contribuyente} ${contrato.SerieMedidor} ${contrato.Contrato}
    `.toLowerCase();
  }

  contratosPorSubir(): Contrato[] {
    return this.contratos.filter((x) => x.tomada && !x.sincronizada);
  }

  buscarPorTermino(termino: string, desde = 0, skip = 30): Contrato[] {
    console.log(`this.contratos.length`, this.contratos.length);
    return this.contratos
      .map((x: Contrato) => {
        return {
          busqueda: this.construirBusqueda(x),
          contrato: x,
        };
      })
      .filter((x) => x.busqueda.includes(termino.toLowerCase().trim()))
      .slice(desde, desde + skip)
      .map((x) => x.contrato as Contrato);
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
  lectura: any;
}
