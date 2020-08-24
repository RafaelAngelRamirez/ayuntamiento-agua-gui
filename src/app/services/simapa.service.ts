import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { URL_BASE } from "../../environments/config.prod";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SimapaService {
  constructor(private http: HttpClient) {}

  subirLectura(lectura:any) {
    return this.http
      .put(URL_BASE("simapa/guardar/lectura"), lectura)
      .pipe(catchError((_) => throwError(_)));
  }
}
