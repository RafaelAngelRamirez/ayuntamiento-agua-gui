import { Injectable } from "@angular/core";
import { LocalStorageService } from "./local-storage.service";
import { Usuario } from "../models/usuario.model";

import { JwtHelperService } from "@auth0/angular-jwt";

const helper = new JwtHelperService();

@Injectable({
  providedIn: "root",
})
export class TokenService {
  key = "token";
  constructor(private ls: LocalStorageService) {}

  obtenerToken(): string {
    return this.ls.leer(this.key) || "";
  }

  guardarToken(token: string) {
    return this.ls.guardar(this.key, token);
  }

  expiracion(): Date | null {
    throw "No defino en expiracion";
  }

  expiro(): boolean {
    return helper.isTokenExpired(this.ls.leer("token") || "");
  }

  obtenerUsuario(): Usuario | null {
    let token = this.ls.leer("token");
    if (!token) return null;

    const decodedToken = helper.decodeToken(token);
    console.log(decodedToken);
    return JSON.parse(JSON.stringify(decodedToken)) as Usuario;
  }
}
