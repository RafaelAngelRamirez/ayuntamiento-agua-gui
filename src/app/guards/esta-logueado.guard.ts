import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from "@angular/router";
import { Observable } from "rxjs";
import { TokenService } from "../services/token.service";
import { JwtHelperService } from "@auth0/angular-jwt";

const helper = new JwtHelperService();

@Injectable({
  providedIn: "root",
})
export class EstaLogueadoGuard implements CanActivate {
  constructor(private tkService: TokenService, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    let usuario = this.tkService.obtenerUsuario();

    if (!usuario) return true;

    let token = this.tkService.obtenerToken();
    if (!token) return true;

    if (helper.isTokenExpired(token)) return true;

    this.router.navigate(["/app" + usuario.navegacionDefault]);

    return false;
  }
}
