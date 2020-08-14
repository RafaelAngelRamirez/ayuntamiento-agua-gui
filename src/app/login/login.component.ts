import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LoginService } from "../services/login.service";
import { NotificacionesService } from "../services/notificaciones.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  cargando: boolean = false;

  loginCorrecto: boolean = false;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private notiService: NotificacionesService
  ) {}

  ngOnInit() {}

  login(usuario: string, password: string, e:any) {


    e.preventDefault()
    e.stopPropagation()

    if (!usuario || !password) {
      this.notiService.toast.error("Debes rellenar todos los campos");
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
