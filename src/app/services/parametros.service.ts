import { Injectable } from "@angular/core";
import { URL_BASE } from "../../environments/config";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class ParametrosService {
  base = URL_BASE("parametros");

  constructor(private http: HttpClient) {}

  actualizarPermisosSuperUsuario() {
    return this.http.put(this.base.concat("/actualizar-permisos"), null);
  }

  obtenerUsuariosSimapa() {
    return this.http.get<any[]>(this.base.concat("/lecturistas"));
  }

  obtenerVigenciaActual(): string {
    // TODO: Crear tabla en indexdb para manejar estos
    // datos y que se sincronizen offline.
    throw "No definido.";
  }

  obtenerPeriodoActual(): string {
    // TODO: Crear parametro en indexdb para manejar este dato.
    // Mismo trabajo que obtenerVigenciaActual
    throw "No definido";
  }
}
