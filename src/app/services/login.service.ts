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

@Injectable({
  providedIn: "root",
})
export class LoginService {
  constructor(
    private router: Router,
    public notiService: NotificacionesService,
    public http: HttpClient,
    public tkService: TokenService,
    public ls: LocalStorageService
  ) {}
  version_gui = version;
  version_api = version;
  base = URL_BASE("login");

  cerraSesion() {
    this.ls.eliminarTodo();
    this.router.navigate(["/login"]);
  }

  login(usuario: string, password: string) {
    return this.http.post(this.base, { usuario, password }).pipe(
      map((resp: any) => {
        this.tkService.guardarToken(resp.token);
        this.version_api = resp.version;
        return true;
      }),
      catchError((x: any) => {
        this.notiService.toast.error(x.error.err);
        return throwError(x);
      })
    );
  }
}
