import { Component, OnInit } from "@angular/core";
import { ParametrosService } from "../../services/parametros.service";
import { NotificacionesService } from "../../services/notificaciones.service";

@Component({
  selector: "app-parametros",
  templateUrl: "./parametros.component.html",
  styleUrls: ["./parametros.component.css"],
})
export class ParametrosComponent implements OnInit {
  constructor(
    private notiService: NotificacionesService,
    private parametrosService: ParametrosService
  ) {}

  cargandoActualizandoPermisos = false;

  ngOnInit(): void {}

  actualizarPermisos() {
    this.cargandoActualizandoPermisos = true;
    this.parametrosService.actualizarPermisosSuperUsuario().subscribe(
      (_) => {
        this.notiService.toast.correcto("Se actualizaron los permisos");
        this.cargandoActualizandoPermisos = false;
      },
      (_) => (this.cargandoActualizandoPermisos = false)
    );
  }
}
