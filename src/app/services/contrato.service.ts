import { Injectable } from "@angular/core";
import { URL_BASE } from "../../environments/config";
import { HttpClient } from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { throwError, Observable, forkJoin } from "rxjs";
import { EstatusConexionService } from "@codice-progressio/estatus-conexion";
import { NotificacionesService } from "./notificaciones.service";
import { IndexedDbService, Offline } from "./offline/indexed-db.service";
import { IndexedDBService as CodiIDBService } from "@codice-progressio/indexed-db";
import { Tarifas } from "../models/usuario.model";

@Injectable({
  providedIn: "root",
})
export class ContratoService {
  estaOnline = false;
  constructor(
    private notiService: NotificacionesService,
    private http: HttpClient,
    private estatus: EstatusConexionService,
    private idbService: IndexedDbService,
    private codiceIdbService: CodiIDBService
  ) {
    this.estatus.online.subscribe((estaOnline) => {
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

  findAllInRoute(ruta: string) {
    return this.http
      .get<Contrato[]>(this.base.concat("/leer/ruta/" + ruta))
      .pipe(
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
          //Esto es solo para afectar la gui. De esta manera sabemos que
          // los contratos ya fueron sincronizados.
          c.sincronizada = true;
          //Se actualiza el contrato
          observables.push(this.update(c));
          //Actualizamos el contrato en indexed-db
          observables.push(this.offline.update(c));
        });

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

  sincronizarContratosTomadosPorOtroLecturista() {
    return this.http.get<Contrato[]>(
      this.base.concat("/leer/contratos/sincronizarTomadasPorOtrosLecturistas")
    );
  }

  confirmarNotificacion(contratosIds: string[]) {
    return this.http.put(
      this.base.concat("/confirmarNotificacion"),
      contratosIds
    );
  }

  offline = new Offline(
    this.idbService.storeObjects.CONTRATOS,
    this.codiceIdbService
  );
}

export interface Contrato {
  _id: string;
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

  Consumo2: number;
  Consumo3: number;
  Consumo4: number;
  Consumo5: number;

  // Este cambia el schema
  // lecturas: [Lectura];
  tomada: boolean;
  sincronizada: boolean;
  lectura: Lectura;

  latitud: number;
  longitud: number;
}

export interface Lectura {
  idUsuario: string;

  Contrato: string;
  Vigencia: string;
  Periodo: string;
  IdLecturista: string;
  IdRuta: string;
  FechaLectura: Date; // 2015-09-07T00:00:00-05:00
  HoraLectura: Date; // 11:32:51
  LecturaActual: number;
  IdTarifa: string;
  IdImpedimento: string;
  IdIncidencia: string;
  ConsumoMts3: number;
  Mts3Cobrados: number;
  Observaciones: string;
  problemas: string;
  IdDispositivo: string;
  Estado: string;
  latitud: number;
  longitud: number;
  importe: number;
  desgloses: {
    tarifa: Tarifas;
    min: number;
    max: number;
    mt3: number;
    costo: number;
    cuotaMinima: number;
  }[];
}
