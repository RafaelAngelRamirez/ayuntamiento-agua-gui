import { Injectable } from "@angular/core";
import { TokenService } from "./token.service";
import { LocalStorageService } from "./local-storage.service";
import { URL_BASE } from "../../environments/config";
import { HttpClient } from "@angular/common/http";
import { map, catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { NotificacionesService } from "./notificaciones.service";
import { Router } from "@angular/router";
import { version } from "../../../package.json";
import { ContratoService } from "./contrato.service";

@Injectable({
  providedIn: "root",
})
export class LoginService {
  constructor(
    private router: Router,
    public notiService: NotificacionesService,
    public http: HttpClient,
    public tkService: TokenService,
    public ls: LocalStorageService,
    public contratoService: ContratoService
  ) {}
  version_gui = version;
  version_api = "0.0.0";
  base = URL_BASE("login");

  cerraSesion() {
    this.ls.eliminarTodo();
    this.router.navigate(["/login"]);
  }

  login(usuario: string, password: string) {
    return this.http.post(this.base, { usuario, password }).pipe(
      map((resp: any) => {
        this.tkService.guardarToken(resp.token);
        return true;
      }),
      catchError((x: any) => {
        this.notiService.toast.error(x.error.err);
        return throwError(x);
      })
    );
  }

  versionApi() {
    return this.http.get(this.base.concat("/version")).pipe(
      map((resp: any) => {
        this.version_api = resp.version;
        return this.version_api;
      })
    );
  }
}
