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
    private impedimentosService: ImpedimentoService
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

  comprobarSincronizacionParametrosLecturista() {
    throw "No definido";
  }
  eliminarParametrosSincronizadosLecturista() {
    throw "No definido";
  }

  listaParametros = {
    incidencias: new SincronizacionLecturista<Incidencia[]>(
      "Incidencias",
      this.incidenciasSincronizar.bind(this),
      this.incidenciasEliminar.bind(this)
    ),
    impedimentos: new SincronizacionLecturista<Impedimento[]>(
      "Impedimentos",
      this.impedimentosSincronizar.bind(this),
      this.impedimentosEliminar.bind(this)
    ),
    vigencia: new SincronizacionLecturista<number>(
      "Vigencia",
      this.vigenciaSincronizar.bind(this),
      this.vigenciaEliminar.bind(this)
    ),
    periodo: new SincronizacionLecturista<number>(
      "Periodo",
      this.periodoSincronizar.bind(this),
      this.periodoEliminar.bind(this)
    ),
    drenaje: new SincronizacionLecturista<Drenaje>(
      "Drenaje",
      this.drenajeSincronizar.bind(this),
      this.drenajeEliminar.bind(this)
    ),
    infrastructura: new SincronizacionLecturista<Infrastructura>(
      "Infrastructura",
      this.infrastructuraSincronizar.bind(this),
      this.infrastructuraEliminar.bind(this)
    ),
    aguasResiduales: new SincronizacionLecturista<AguasResiduales>(
      "Aguas residuales",
      this.aguasResidualesSincronizar.bind(this),
      this.aguasResidualesEliminar.bind(this)
    ),
    tarifas: new SincronizacionLecturista<Tarifas>(
      "Tarifas",
      this.tarifasSincronizar.bind(this),
      this.tarifasEliminar.bind(this)
    ),
    rutas: new SincronizacionLecturista<Rutas>(
      "Rutas",
      this.rutasSincronizar.bind(this),
      this.rutasEliminar.bind(this)
    ),
  };

  private obtenerLecturista(): Promise<Lecturista> {
    return new Promise((resolve, reject) => {
      this.usuarioService
        .findById(this.usuarioService.obtenerUsuario()._id)
        .subscribe(
          (usuario: Usuario) => {
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

  private incidenciasSincronizar() {
    this.listaParametros.incidencias.cargando = true;
    this.incidenciasSerivice
      .findAll()
      .toPromise()
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

    this.incidenciasSerivice.offline.deleteAll().subscribe(() => {
      this.listaParametros.incidencias.cargando = false;

      this.notiService.toast.correcto(
        "Se eliminaron las incidencias sincronizadas. Deberas descargarlas de nuevo"
      );
    });
  }

  private impedimentosSincronizar() {
    this.listaParametros.impedimentos.cargando = true;
    this.impedimentosService
      .findAll()
      .toPromise()
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

    this.impedimentosService.offline.deleteAll().subscribe(() => {
      this.listaParametros.impedimentos.cargando = false;

      this.notiService.toast.correcto(
        "Se eliminaron las impedimentos sincronizadas. Deberas descargarlas de nuevo"
      );
    });
  }

  private vigenciaSincronizar() {
    this.listaParametros.vigencia.cargando = true;
    this.obtenerLecturista()
      .then((lecturista) => {
        let vigencia = lecturista.parametros.rutas[0].VigenciaRuta;

        if (!vigencia) throw "No se pudo cargar la vigencia.";
      })
      .catch((err) => {
        this.notiService.toast.error(err);
        this.listaParametros.vigencia.cargando = false;
      });
  }
  private vigenciaEliminar() {
    throw "No definido";
  }
  private periodoSincronizar() {
    throw "No definido";
  }
  private periodoEliminar() {
    throw "No definido";
  }
  private drenajeSincronizar() {
    throw "No definido";
  }
  private drenajeEliminar() {
    throw "No definido";
  }
  private infrastructuraSincronizar() {
    throw "No definido";
  }
  private infrastructuraEliminar() {
    throw "No definido";
  }
  private aguasResidualesSincronizar() {
    throw "No definido";
  }
  private aguasResidualesEliminar() {
    throw "No definido";
  }
  private tarifasSincronizar() {
    throw "No definido";
  }
  private tarifasEliminar() {
    throw "No definido";
  }
  private rutasSincronizar() {
    throw "No definido";
  }
  private rutasEliminar() {
    throw "No definido";
  }
  private periodosSincronizar() {
    throw "No definido";
  }
  private periodosEliminar() {
    throw "No definido";
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
