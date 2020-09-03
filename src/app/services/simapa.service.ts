import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { URL_BASE } from "../../environments/config.prod";
import { catchError, map } from "rxjs/operators";
import { throwError, forkJoin } from "rxjs";
import { Contrato, ContratoService } from "./contrato.service";
import { IndexedDBService } from "@codice-progressio/indexed-db";

@Injectable({
  providedIn: "root",
})
export class SimapaService {
  base = URL_BASE("simapa");

  constructor(
    private http: HttpClient,
    private contratoService: ContratoService,
    private idbService: IndexedDBService
  ) {}

  subirLectura(lectura: any) {
    return this.http
      .put(URL_BASE("simapa/guardar/lectura"), lectura)
      .pipe(catchError((_) => throwError(_)));
  }

  sincronizar() {
    return this.http.get<Contrato[]>(this.base.concat("/sincronizar/contratos")).pipe(
      map((x) => {
        this.contratoService.contratos = x;
        return forkJoin(x.map((contrato) => this.idbService.save(contrato)));
      }),

      map((r) => this.contratoService.contratos),
      catchError((x) => throwError(x))
    );
  }
}
