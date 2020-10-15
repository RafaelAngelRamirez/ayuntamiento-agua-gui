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
  detectarHeroku(){
    return this.http.get(this.base.concat("/detectarHeroku"))
  }



}
