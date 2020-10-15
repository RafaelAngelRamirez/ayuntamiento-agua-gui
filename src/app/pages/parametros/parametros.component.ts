import { Component, OnInit } from "@angular/core";
import { ParametrosService } from "../../services/parametros.service";
import { NotificacionesService } from "../../services/notificaciones.service";
import { Usuario, Lecturista } from "../../models/usuario.model";
import { UsuarioService } from "../../services/usuario.service";
import { FormControl } from "@angular/forms";

@Component({
  selector: "app-parametros",
  templateUrl: "./parametros.component.html",
  styleUrls: ["./parametros.component.css"],
})
export class ParametrosComponent implements OnInit {
  constructor(
    private notiService: NotificacionesService,
    private parametrosService: ParametrosService,
    private usuarioService: UsuarioService
  ) {}

  cargandoActualizandoPermisos = false;

  lecturistas: Lecturista[] = [];
  cargandoUsuariosSimapa = false;
  detalleLecturista: Lecturista | null = null;
  usuarios: Usuario[] = [];
  cargandoUsuarios = false;

  selectUsuario = new FormControl();

  ngOnInit(): void {
    this.cargarUsuariosSimapa();
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.cargandoUsuarios = false;
    this.usuarioService.findAll().subscribe(
      (usus) => {
        this.usuarios = usus;
        this.cargandoUsuarios = false;
      },
      (_) => (this.cargandoUsuarios = false)
    );
  }

  private cargarUsuariosSimapa() {
    this.cargandoUsuariosSimapa = true;
    this.parametrosService.obtenerUsuariosSimapa().subscribe(
      (us) => {
        this.lecturistas = us;
        this.cargandoUsuariosSimapa = false;
      },
      (_) => (this.cargandoUsuariosSimapa = false)
    );
  }

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


  resultadoHeroku = ""
  detectarHeroku(url:string) {
    this.parametrosService.detectarHeroku(url).subscribe((_) => {
      this.notiService.toast.correcto("Heroku enviado");
      this.resultadoHeroku = _
      console.log(_);
    });
  }
}
