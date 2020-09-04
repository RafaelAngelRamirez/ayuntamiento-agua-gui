import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LoginService } from "../services/login.service";
import { NotificacionesService } from "../services/notificaciones.service";
import { IndexedDBService } from "@codice-progressio/indexed-db";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  cargando: boolean = false;

  loginCorrecto: boolean = false;
  compatible = true;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private notiService: NotificacionesService,
    private dbService: IndexedDBService
  ) {}

  ngOnInit() {
    if (!("indexedDB" in window)) {
      this.notiService.toast.error(
        "Esta aplicacion necesita forzozamente trabajar con IndexDB.",
        "Navegador incompatible"
      );
      this.compatible = false;
      return;
    }
  }

  login(usuario: string, password: string, e: any) {
    e.preventDefault();
    e.stopPropagation();

    if (!this.compatible) {
      this.notiService.toast.error(
        "No se puede iniciar la aplicacion en este navegador.",
        "Navegador incompatible con IndexDB"
      );

      return;
    }

    if (!usuario || !password) {
      this.notiService.toast.warning("Debes rellenar todos los campos");
      return;
    }
    this.cargando = true;
    this.loginService.login(usuario, password).subscribe(
      (correcto) => {
        this.cargando = false;
        if (correcto) {
          this.router.navigate(["/tablero"]);
          return;
        }
      },
      (_) => (this.cargando = false)
    );
  }
}
