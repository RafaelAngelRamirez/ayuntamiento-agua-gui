import { Injectable } from "@angular/core";
import {
  CanActivate,
  CanLoad,
  Route,
  UrlSegment,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from "@angular/router";
import { Observable } from "rxjs";
import { NotificacionesService } from "../services/notificaciones.service";
import { Usuario } from "../models/usuario.model";
import { UsuarioService } from "../services/usuario.service";
import { TokenService } from "../services/token.service";

import { JwtHelperService } from "@auth0/angular-jwt";
import { LoginService } from "../services/login.service";

const helper = new JwtHelperService();

@Injectable({
  providedIn: "root",
})
export class ValidaLoginGuard implements CanActivate, CanLoad {
  constructor(
    private loginService: LoginService,
    private router: Router,
    private notiService: NotificacionesService,
    private tkService: TokenService
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.validarLogin(next.data?.permission);
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.validarLogin(route.data?.permission);
  }

  validarLogin(permisoRequerido: string = ""): boolean {
    //Token existe
    let continuar = this.tokenValido(this.tkService.obtenerToken());
    if (!continuar) {
      this.notiService.toast.error("No has iniciado sesion");
      this.irALogin();
      return false;
    }

    //Tiene permiso de login
    let usuario = this.tkService.obtenerUsuario();
    console.log("paso", usuario)
    let tienePermiso = usuario?.permissions.includes("login");
    if (!tienePermiso) {
      this.notiService.toast.info("Tu usuario esta desactivado.");
      return false;
    }

    //Tiene el permiso para ver el contenido
    if (!usuario?.permissions.includes(permisoRequerido)) {
    //   this.notiService.toast.info(
      this.notiService.toast.info(
        "No tienes permisos para acceder al contenido solicitado: " +
          permisoRequerido
      );

      this.irALogin();
      return false;
    }

    return true;
  }

  tokenValido(token: string): boolean {
    let valido = true;
    if (!token) {
      valido = false;
    }
    if (helper.isTokenExpired(token)) {
      valido = false;
    }
    return valido;
  }

  irALogin() {
    this.loginService.cerraSesion();
    this.router.navigate(["/login"]);
  }
}
