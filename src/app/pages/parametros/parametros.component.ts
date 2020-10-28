import { Component, OnInit } from "@angular/core";
import { ParametrosService } from "../../services/parametros.service";
import { NotificacionesService } from "../../services/notificaciones.service";
import {
  Usuario,
  Lecturista,
  AguasResiduales,
  Drenaje,
  Infrastructura,
  Rutas,
  Tarifas,
} from "../../models/usuario.model";
import { UsuarioService } from "../../services/usuario.service";
import { FormControl } from "@angular/forms";
import { SimapaService } from "../../services/simapa.service";
import {
  Incidencia,
  IncidenciaService,
} from "../../services/incidencia.service";
import { catchError } from "rxjs/operators";
import { TienePermisoPipe } from "../../pipes/tiene-permiso.pipe";
import {
  Impedimento,
  ImpedimentoService,
} from "../../services/impedimento.service";

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
    private usuarioService: UsuarioService,
    private incidenciasSerivice: IncidenciaService,
    private impedimentosService: ImpedimentoService,
    private tienePermisoPipe: TienePermisoPipe
  ) {}

  totalDeContratos = 0;
  contratosPendientesDeSincronizar = 0;
  contratosSincronizados = 0;

  cargandoActualizandoPermisos = false;

  lecturistas: Lecturista[] = [];
  cargandoUsuariosSimapa = false;
  detalleLecturista: Lecturista | null = null;
  usuarios: Usuario[] = [];
  cargandoUsuarios = false;

  selectUsuario = new FormControl();

  ngOnInit(): void {
    let esAdministrador = this.usuarioService
      .obtenerUsuario()
      .permissions.includes("administrador");

    if (esAdministrador) {
      this.cargarUsuariosSimapa();
      this.cargarEstadisticas();
      this.cargarUsuarios();
      this.cargarPeriodoVigecina();
    }
  }

  cargandoEstadisticas = false;
  cargarEstadisticas() {
    this.cargandoEstadisticas = true;
    this.parametrosService.obtenerEstadisticasSincronizacion().subscribe(
      (resultado: any) => {
        this.cargandoEstadisticas = false;
        this.totalDeContratos = resultado.totalDeContratos;
        this.contratosPendientesDeSincronizar =
          resultado.contratosPendientesDeSincronizar;
        this.contratosSincronizados = resultado.contratosSincronizados;
        this.notiService.toast.correcto("Estadisticas sincronizadas");
      },
      (_) => (this.cargandoEstadisticas = false)
    );
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

  listaParametros = {
    vigenciaYPeriodo: new SincronizacionLecturista<{
      vigencia: number;
      periodo: number;
    }>(
      "1.- Vigencia",
      this.parametrosVigenciaYPeriodoSincronizar.bind(this),
      this.parametrosVigenciaYPeriodoEliminar.bind(this)
    ),
    incidencias: new SincronizacionLecturista<Incidencia[]>(
      "2.- Incidencias",
      this.incidenciasSincronizar.bind(this),
      this.incidenciasEliminar.bind(this)
    ),

    impedimentos: new SincronizacionLecturista<Impedimento[]>(
      "3.- Impedimentos",
      this.impedimentosSincronizar.bind(this),
      this.impedimentosEliminar.bind(this)
    ),

    ticket: new SincronizacionLecturista<Lecturista>(
      "4.- Parametros ticket",
      this.parametrosTicketSincronizar.bind(this),
      this.parametrosTicketEliminar.bind(this)
    ),
  };

  obtenerListaDeParametrosOrdenados = [
    "vigenciaYPeriodo",
    "incidencias",
    "impedimentos",
    "ticket",
  ];

  private obtenerLecturista(): Promise<Lecturista> {
    return new Promise(async (resolve, reject) => {
      let usuarioLocal = this.usuarioService.obtenerUsuario();
      let usuario = await this.usuarioService
        .findById(usuarioLocal._id)
        .toPromise();
      if (!usuario) {
        this.notiService.toast.error(
          "No de pudo cargar el usuario. Vuelve a iniciar sesión. "
        );

        return reject("No se encontro el usuario");
      }

      if (!usuario._id) return reject("No se puede buscar el usuario");
      this.usuarioService.findById(usuario._id).subscribe(
        (usuario: Usuario) => {
          console.log(usuario);
          if (!usuario.lecturista) {
            this.notiService.toast.error(
              "Debes comunicarte con el administrador para asiganar un lecturista a este usuario",
              "USUARIO SIN LECTURISTA"
            );
            return reject();
          }

          return resolve(usuario.lecturista);
        },
        (err: any) => reject(err)
      );
    });
  }

  vigenciaYPeriodoCargados(): Promise<boolean> {
    return this.parametrosService.offline
      .obtenerVigenciaYPeriodo()
      .toPromise()
      .then((dato: any) => {
        if (!dato?.vigPer || !dato?.vigPer) {
          throw new Error("No se ha definido vigencia y periodo");
        }

        return true;
      });
  }

  private incidenciasSincronizar() {
    this.vigenciaYPeriodoCargados()
      .then((seguir) => {
        this.listaParametros.incidencias.cargando = true;
        return this.incidenciasSerivice.findAll().toPromise();
      })

      .then((incidencias) => {
        if (incidencias.length === 0) {
          throw "No hay incidencias registradas";
        }

        let promesas = incidencias.map((x) =>
          this.incidenciasSerivice.offline.save(x).toPromise()
        );
        this.listaParametros.incidencias.datos = incidencias;

        return Promise.all(promesas);
      })
      .then((re) => {
        this.notiService.toast.correcto(
          `Se sincronizaron ${re.length} incidencias`
        );
        this.listaParametros.incidencias.cargando = false;
      })
      .catch((err) => {
        this.notiService.toast.error("Error en incidencias", err);
        this.listaParametros.incidencias.cargando = false;
      });
  }
  private incidenciasEliminar() {
    this.listaParametros.incidencias.cargando = true;

    this.incidenciasSerivice.offline.deleteAll().subscribe(
      () => {
        this.listaParametros.incidencias.cargando = false;

        this.notiService.toast.correcto(
          "Se eliminaron las incidencias sincronizadas. Deberas descargarlas de de nuevo"
        );
      },
      (_) => (this.listaParametros.incidencias.cargando = false)
    );
  }

  private impedimentosSincronizar() {
    this.vigenciaYPeriodoCargados()
      .then((seguir) => {
        this.listaParametros.impedimentos.cargando = true;
        return this.impedimentosService.findAll().toPromise();
      })
      .then((impedimentos) => {
        if (impedimentos.length === 0) {
          throw "No hay impedimentos registradas";
        }

        let promesas = impedimentos.map((x) =>
          this.impedimentosService.offline.save(x).toPromise()
        );

        this.listaParametros.impedimentos.datos = impedimentos;

        return Promise.all(promesas);
      })
      .then((re) => {
        this.notiService.toast.correcto(
          `Se sincronizaron ${re.length} impedimentos`
        );
        this.listaParametros.impedimentos.cargando = false;
      })
      .catch((err) => {
        this.notiService.toast.error("Error en impedimentos", err);
        this.listaParametros.impedimentos.cargando = false;
      });
  }

  private impedimentosEliminar() {
    this.listaParametros.impedimentos.cargando = true;

    this.impedimentosService.offline.deleteAll().subscribe(
      () => {
        this.listaParametros.impedimentos.cargando = false;

        this.notiService.toast.correcto(
          "Se eliminaron los impedimentos sincronizados. Deberas descargarlos de nuevo"
        );
      },
      (_) => (this.listaParametros.impedimentos.cargando = false)
    );
  }
  private parametrosTicketSincronizar() {
    this.vigenciaYPeriodoCargados()
      .then((seguir) => {
        return this.obtenerLecturista();
      })
      .then((lecturista) => {
        this.listaParametros.ticket.datos = lecturista;

        return this.parametrosService.offline
          .guardarLecturista(lecturista)
          .toPromise();
      })
      .then((re) => {
        this.notiService.toast.correcto(
          `Se sincronizaron los parametros para el ticket`
        );
        this.listaParametros.ticket.cargando = false;
      })
      .catch((err) => {
        this.notiService.toast.error("Error en ticket", err);
        this.listaParametros.ticket.cargando = false;
      });
  }

  private parametrosTicketEliminar() {
    this.listaParametros.ticket.cargando = true;

    this.parametrosService.offline.eliminarParametrosTicket().subscribe(
      () => {
        this.listaParametros.ticket.cargando = false;

        this.notiService.toast.correcto(
          "Se eliminaron los parametros del ticket sincronizados. Deberas descargarlos de nuevo"
        );
      },
      (_) => (this.listaParametros.ticket.cargando = false)
    );
  }
  private parametrosVigenciaYPeriodoSincronizar() {
    this.parametrosService
      .cargarPeriodoVigencia()
      .toPromise()
      .then((vigPer) => {
        this.listaParametros.vigenciaYPeriodo.datos = vigPer;

        return this.parametrosService.offline
          .guardarVigenciaYPeriodo(vigPer)
          .toPromise();
      })
      .then((re) => {
        this.notiService.toast.correcto(
          `Se sincronizaron los parametros para la vigencia y periodo`
        );
        this.listaParametros.vigenciaYPeriodo.cargando = false;
      })
      .catch((err) => {
        this.notiService.toast.error("Error en vigencia y periodo", err);
        this.listaParametros.vigenciaYPeriodo.cargando = false;
      });
  }

  private parametrosVigenciaYPeriodoEliminar() {
    this.listaParametros.vigenciaYPeriodo.cargando = true;

    this.parametrosService.offline.eliminarVigenciaYPeriodo().subscribe(
      () => {
        this.listaParametros.vigenciaYPeriodo.cargando = false;

        this.notiService.toast.correcto(
          "Se eliminaron los parametros de vigencia y periodo sincronizados. Deberas descargarlos de nuevo"
        );
      },
      () => (this.listaParametros.vigenciaYPeriodo.cargando = false)
    );
  }

  archivarContratos() {
    // this.parametrosService.archivarContratos().subscribe()
    this.notiService.toast.warning("No disponible en este momento");
  }

  subiendoLecturasASimapa = false;
  timerSubidaLecturas = new Date();
  subirLecturasASimapa() {
    {
      this.subiendoLecturasASimapa = true;
      this.simapaService.subirLecturasASimapa().subscribe(
        (r: any) => {
          console.log(r);
          this.subiendoLecturasASimapa = false;
          let rechazos = r.rechazados.length;
          if (rechazos > 0) {
            this.notiService.toast.error(
              `No se sincronizaron ${rechazos} contrato${
                rechazos > "1" ? "s" : ""
              } `
            );
          }
          let correctos = r.correctos.length;
          if (correctos > 0) {
            this.notiService.toast.correcto(
              `Se sincronizaron ${correctos} contrato${
                correctos > "1" ? "s" : ""
              }`
            );
          }

          this.cargarEstadisticas();
        },
        (_) => (this.subiendoLecturasASimapa = false)
      );
    }
  }

  vigencia: number | null = null;
  periodo: number | null = null;
  cargandoVigenciaYPeriodo = false;
  actualizarPeriodoYVigencia() {
    //No pueden estar vacios.
    if (!this.vigencia) {
      this.notiService.toast.error("La vigencia no puede estar vacia");
      return;
    }

    if (!this.periodo) {
      this.notiService.toast.error("El periodo no puede estar vacio");
      return;
    }

    this.cargandoVigenciaYPeriodo = true;
    this.parametrosService
      .actualizarPeriodoYVigencia(this.periodo, this.vigencia)
      .subscribe(
        () => {
          this.cargandoVigenciaYPeriodo = false;

          this.notiService.toast.correcto(
            "Se actualizaron la vigencia y el periodo actuales"
          );
        },
        () => {
          this.cargandoVigenciaYPeriodo = false;
        }
      );
  }

  cargarPeriodoVigecina() {
    this.cargandoVigenciaYPeriodo = true;
    this.parametrosService.cargarPeriodoVigencia().subscribe(
      (res: any) => {
        this.periodo = res.periodo;
        this.vigencia = res.vigencia;
        this.cargandoVigenciaYPeriodo = false;
      },
      () => (this.cargandoVigenciaYPeriodo = false)
    );
  }
}

class SincronizacionLecturista<T> {
  constructor(
    public nombre: string,
    public sincronizar: Function = () => {
      throw "No definido";
    },
    public eliminar: Function = () => {
      throw "No definido";
    },
    public cargando = false,
    public datos?: T
  ) {}
}
