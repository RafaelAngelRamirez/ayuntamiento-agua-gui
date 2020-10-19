import { Component, OnInit } from "@angular/core";
import { ParametrosService } from "../../services/parametros.service";
import { NotificacionesService } from "../../services/notificaciones.service";
import { Usuario, Lecturista } from "../../models/usuario.model";
import { UsuarioService } from "../../services/usuario.service";
import { FormControl } from "@angular/forms";
import { SimapaService } from "../../services/simapa.service";

@Component({
  selector: "app-parametros",
  templateUrl: "./parametros.component.html",
  styleUrls: ["./parametros.component.css"],
})
export class ParametrosComponent implements OnInit {
  constructor(
    private simapaService: SimapaService,
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
    this.cargarVigenciaActual();
    this.cargarPeriodoActual();
  }

  cargarVigenciaActual() {
    this.parametrosService.obtenerVigenciaActual().subscribe((p) => {
      this.vigenciaActual = p;
    });
  }
  cargarPeriodoActual() {
    this.parametrosService.obtenerPeriodoActual().subscribe((p) => {
      this.periodoActual = p;
    });
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

  sincronizandoParametros = false;

  sincronizarParametros() {
    this.sincronizandoParametros = true;

    this.simapaService.sincronizarParametros().subscribe(
      (resultado) => {
        this.cargarUsuariosSimapa();
        this.sincronizandoParametros = false;
        this.notiService.toast.correcto(
          "Se sincronizaron los datos correctamente"
        );
      },
      () => {
        this.sincronizandoParametros = false;
      }
    );
  }

  sincronizandoContratos = false;
  sincronizarContratos() {
    this.sincronizandoContratos = true;
    this.simapaService.sincronizarContratos().subscribe(
      (resultado: any) => {
        this.sincronizandoContratos = false;
        this.notiService.toast.correcto(
          "Contatos sincronizados: " + resultado.total
        );
      },
      () => (this.sincronizandoContratos = false)
    );
  }

  vigenciaActual: number | undefined = undefined;
  guardandoVigenciaActual = false;
  periodoActual: number | undefined = undefined;
  guardandoPeridoActual = false;

  almacenarVigencia() {
    this.guardandoVigenciaActual = true;
    if (!this.vigenciaActual) {
      this.notiService.toast.error("No definiste vigencia actual");
      this.guardandoVigenciaActual = false;
      return;
    }
    this.parametrosService.guardarVigenciaActual(this.vigenciaActual).subscribe(
      () => {
        this.guardandoVigenciaActual = false;
        this.notiService.toast.correcto(" Se modifico la vigencia actual");
      },
      () => (this.guardandoVigenciaActual = false)
    );
  }

  almacenarPeriodoActual() {
    this.guardandoPeridoActual = true;
    if (!this.periodoActual) {
      this.notiService.toast.error("No definiste periodo actual");
      this.guardandoPeridoActual = false;
      return;
    }
    this.parametrosService.guardarPeriodoActual(this.periodoActual).subscribe(
      () => {
        this.guardandoPeridoActual = false;
        this.notiService.toast.correcto(" Se modifico el perido actual");
      },
      () => (this.guardandoPeridoActual = false)
    );
  }
}
