import { Component, OnInit } from "@angular/core";
import { ParametrosService } from "../../services/parametros.service";
import { NotificacionesService } from "../../services/notificaciones.service";
import { Usuario, Lecturista, Rutas } from "../../models/usuario.model";
import { UsuarioService } from "../../services/usuario.service";
import { FormControl } from "@angular/forms";
import { SimapaService } from "../../services/simapa.service";
import {
  Incidencia,
  IncidenciaService,
} from "../../services/incidencia.service";
import { TienePermisoPipe } from "../../pipes/tiene-permiso.pipe";
import { ContratosPendientesSincronizarComponent } from "../../components/contratos-pendientes-sincronizar/contratos-pendientes-sincronizar.component";
import { ContratoService } from "../../services/contrato.service";
import { ZebraService } from "../../services/zebra/zebra.service";
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
    private contratoService: ContratoService,
    private simapaService: SimapaService,
    private notiService: NotificacionesService,
    private parametrosService: ParametrosService,
    private usuarioService: UsuarioService,
    private incidenciasSerivice: IncidenciaService,
    private impedimentosService: ImpedimentoService,
    private tienePermisoPipe: TienePermisoPipe,
    public zebraService: ZebraService
  ) {}
  contratosPendientesSincronizarComponent!: ContratosPendientesSincronizarComponent;

  cargandoActualizandoPermisos = false;

  lecturistas: Lecturista[] = [];
  cargandoUsuariosSimapa = false;
  detalleLecturista: Lecturista | null = null;
  usuarios: Usuario[] = [];
  cargandoUsuarios = false;

  selectUsuario = new FormControl();

  rutaSeleccionada: Rutas | undefined = undefined;
  rutasDisponibles: Rutas[] = [];

  ngOnInit(): void {
    let esAdministrador = this.usuarioService
      .obtenerUsuario()
      .permissions.includes("administrador");

    if (esAdministrador) {
      this.cargarUsuariosSimapa();

      this.cargarUsuarios();
      this.cargarPeriodoVigecina();
    }

    this.cargarRutas();
    this.obtenerRutaSeleccionada();
  }

  cargandoRutas = false;
  cargarRutas() {
    this.cargandoRutas = true;
    this.parametrosService.obtenerRutas().subscribe(
      (rutas) => {
        this.cargandoRutas = false;
        this.rutasDisponibles = rutas;
      },
      () => (this.cargandoRutas = false)
    );
  }

  guardarRutaSeleccionada() {
    if (!this.rutaSeleccionada) {
      this.notiService.toast.error("Debes seleccionar una ruta de la lista");
      return;
    }
    this.parametrosService.offline
      .guardarRuta(this.rutaSeleccionada)
      .subscribe(() => {
        this.notiService.toast.correcto("Se guardo la ruta a descargar");
      });
  }

  eliminarRutaSeleccionada() {
    this.parametrosService.offline.eliminarRutaSeleccionada().subscribe(() => {
      this.rutaSeleccionada = undefined;
      this.notiService.toast.error("Se elimino ruta para sincronización");
    });
  }

  obtenerRutaSeleccionada() {
    this.parametrosService.offline
      .obtenerRutaSeleccionada()
      .subscribe((datos) => {
        this.rutaSeleccionada = datos as Rutas;
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
    this.parametrosService
      .cargarPeriodoVigencia()
      .toPromise()
      .then((datos) => {
        if (!datos.periodo) throw "No has definido el periodo actual";

        if (!datos.vigencia) throw "No has definido la vigencia actual";

        let vigYPer = this.lecturistas
          .map(
            (x) =>
              x.parametros.rutas.map((a) => {
                return { vigencia: a.VigenciaRuta, periodo: a.PeriodoRuta };
              })[0]
          )
          .filter((x) => !!x);

        let vigencias = Array.from(new Set(vigYPer.map((x) => x.vigencia)));
        let periodos = Array.from(new Set(vigYPer.map((x) => x.periodo)));

        if (vigencias.length > 1)
          throw `Se detectaron multiples vigencias cargadas en los lecturistas del simapa: ${vigencias.toString()}`;

        if (periodos.length > 1)
          throw `Se detectaron multiples periodos cargados en los lecturistas del simapa: ${periodos.toString()}`;

        let vigenciaActualSimapa = Number(vigencias.pop());
        let periodoActualSimapa = Number(periodos.pop());

        if (datos.periodo !== periodoActualSimapa)
          throw `El periodo definido acltuamente (${datos.periodo}) difiere del SIMAPA (${periodoActualSimapa}). NO SE PUEDE CONTINUAR`;

        if (datos.vigencia !== vigenciaActualSimapa)
          throw `La vigencia definida acltuamente (${datos.vigencia}) difiere del SIMAPA (${vigenciaActualSimapa}). NO SE PUEDE CONTINUAR`;

        this.sincronizandoContratos = true;
        this.simapaService.sincronizarContratos().subscribe(
          (resultado: any) => {
            this.sincronizandoContratos = false;
            this.notiService.toast.correcto(
              "Contatos sincronizados: " + resultado.total
            );

            this.cargarEstadisticas();
          },
          () => (this.sincronizandoContratos = false)
        );
      })
      .catch((error) => {
        this.notiService.toast.error(error);
      });
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
    return new Promise((resolve, reject) => {
      let usuarioLocal = this.usuarioService.obtenerUsuario();

      if (!usuarioLocal) {
        this.notiService.toast.error(
          "No de pudo cargar el usuario. Vuelve a iniciar sesión. "
        );

        return reject("No se encontro el usuario");
      }

      if (!usuarioLocal._id) return reject("No se puede buscar el usuario");

      if (!usuarioLocal.lecturista) {
        this.notiService.toast.error(
          "Debes comunicarte con el administrador para asiganar un lecturista a este usuario",
          "USUARIO SIN LECTURISTA"
        );
        return reject();
      }

      return resolve(usuarioLocal.lecturista);
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

            console.log("Contratos rechazados: ", r.rechazados);
          }
          let correctos = r.correctos.length;
          if (correctos > 0) {
            this.notiService.toast.correcto(
              `Se sincronizaron ${correctos} contrato${
                correctos > "1" ? "s" : ""
              }`
            );
          }

          if (r.contratosPorSincronizar > 0) {
            this.subirLecturasASimapa();
          } else {
            this.cargarEstadisticas();
          }
        },
        (_) => (this.subiendoLecturasASimapa = false)
      );
    }
  }

  cargarEstadisticas() {
    this.contratosPendientesSincronizarComponent?.cargarEstadisticas();
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

  archivandoPeriodo = false;
  /**
   *Lanza la acción de archivado de contratos
   *
   * @memberof ParametrosComponent
   */
  archivarPeriodo() {
    if (this.archivandoPeriodo) return;
    this.archivandoPeriodo = true;

    //Confirmar la accion
    this.notiService.sweet.confirmacion(
      "Esta acción <b>no se puede deshacer</b>. ¿Aun asi quieres continuar",
      "ARCHIVAR CONTRATOS Y LECTURAS",

      () => this.comprobarContratosPendientesSincronizar(),
      () => {
        this.notiService.sweet.alerta(
          "No se archivaron los contratos",
          "Cancelaste la acción",
          "info"
        );

        this.archivandoPeriodo = false;
      }
    );
  }

  private comprobarContratosPendientesSincronizar() {
    //Sincronizar los contratos faltantes con simapa

    this.parametrosService.obtenerEstadisticasSincronizacion().subscribe(
      (estadisticas: any) => {
        let pendientes = estadisticas.contratosPendientesDeSincronizar;

        if (pendientes > 0) {
          this.notiService.sweet.confirmacion(
            `Hay ${pendientes} ${
              pendientes > 1 ? "contratos pendientes" : "contrato pendiente"
            } por sincronizar con simapa. ¿Quieres sincronizarlos antes de archivar?`,

            "Pendiente por sincronizar",
            () => {
              this.notiService.toast.warning(
                "Sincroniza los contratos con simapa para poder continuar"
              );
              this.archivandoPeriodo = false;
            },
            () => {
              this.ejecutarArchivado();
            }
          );
        } else {
          this.ejecutarArchivado();
        }
      },
      () => (this.archivandoPeriodo = false)
    );
  }

  private ejecutarArchivado() {
    this.parametrosService.archivarContratos().subscribe(
      (datos: any) => {
        let restantes = datos.contratosRestantes;
        console.log(`contratosRestantes`,restantes)
        if (restantes > 0) {
          this.notiService.toast.correcto(
            `${restantes} contratos por sincronizar. No cierres el navegador`
          );

          this.ejecutarArchivado();
        } else {
          this.notiService.sweet.alerta(
            "Se archivaron los contratos de manera correcta",
            "Archivado completo",
            "success"
          );
          this.cargarPeriodoVigecina()
          this.cargarEstadisticas()
          this.archivandoPeriodo = false;
        }
      },
      (_) => (this.archivandoPeriodo = false)
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
