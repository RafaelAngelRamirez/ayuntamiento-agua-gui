import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { BehaviorSubject } from "rxjs";
import { PeriodoAMesesService } from "../../../services/periodo-ameses.service";
import { Lecturista } from "../../../models/usuario.model";
import { ParametrosService } from "../../../services/parametros.service";
import { FechaService } from "../../../services/fecha.service";
import { NotificacionesService } from "../../../services/notificaciones.service";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

@Component({
  selector: "app-filtros-metricas",
  templateUrl: "./filtros-metricas.component.html",
  styleUrls: ["./filtros-metricas.component.css"],
})
export class FiltrosMetricasComponent implements OnInit {
  @Output() cadena = new EventEmitter<string>();

  carga = new BehaviorSubject<boolean>(false);

  lecturistas: Lecturista[] = [];
  periodos: { periodo: string; valor: number }[] = [];

  vigenciaPeriodo: { vigencia: number; periodo: number } = {
    vigencia: 0,
    periodo: 0,
  };

  filtrosSeleccionados: (string | null)[] = [];

  constructor(
    private notiService: NotificacionesService,
    private fechaService: FechaService,
    private parametrosService: ParametrosService,
    private periodoAMesesService: PeriodoAMesesService
  ) {}
  form = new FormGroup({
    fechaLimiteInferior: new FormControl(""),
    fechaLimiteSuperior: new FormControl(""),
    vigencia: new FormControl(""),
    periodo: new FormControl(""),
    lecturista: new FormControl(""),
    calle: new FormControl(""),
    colonia: new FormControl(""),
    poblacion: new FormControl(""),
  });

  ngOnInit(): void {
    this.obtenerUsuariosSimapa();
    this.obtenerPeriodosAMeses();
    this.cambiosDeFormulario();
    this.cargarPeriodoYVigencia();
    this.escucharCargaExterna();
  }

  obtenerUsuariosSimapa() {
    this.parametrosService.obtenerUsuariosSimapa().subscribe((usa) => {
      this.lecturistas = usa;
    });
  }

  /**
   *Creamos un BehaviorSubject para escuchar cuando un componente
   * externo esta cargando. Lo obtenemos en el output de cadena.
   *
   * @memberof FiltrosMetricasComponent
   */
  escucharCargaExterna() {
    this.carga.subscribe((cargando) => {
      cargando ? this.form.disable() : this.form.enable();
    });
  }

  cargarPeriodoYVigencia() {
    this.parametrosService.cargarPeriodoVigencia().subscribe((datos) => {
      this.vigenciaPeriodo = datos;
      this.setVigenciaPeriodo(
        this.vigenciaPeriodo.vigencia,
        this.vigenciaPeriodo.periodo
      );
    });
  }
  cambiosDeFormulario() {
    // Emitimos los eventos cuando haya un cambio en el formulario.
    this.form.valueChanges.subscribe((values) => {
      this.submit(values);
    });
  }

  obtenerPeriodosAMeses() {
    let contador = 0;
    this.periodos = this.periodoAMesesService.equivalencia.map((x) => {
      contador++;
      return {
        periodo: x,
        // Los periodos empiezan desde 1
        valor: contador,
      };
    });
  }

  setVigenciaPeriodo(vigencia: number, periodo: number) {
    // Por defecto dejamos la vigencia y periodos actuales
    // cada vez que reiniciamos. Evitamos problemillas de rendimiento
    this.form.patchValue(
      {
        vigencia,
        periodo,
      },
      { emitEvent: false }
    );
    this.form.updateValueAndValidity();
  }

  submit(modelo: any) {
    // Si es correcto generamos una cadena de texto formateada como
    // parametros de url.

    this.filtrosSeleccionados = Object.keys(modelo)
      .map((x) => {
        let esFecha = false;
        if (x === "fechaLimiteInferior" || x === "fechaLimiteSuperior")
          esFecha = true;
        //Parametros en nulo no pasan
        if (!modelo[x]) return null;
        return `${x}=${esFecha ? this.convertirFecha(modelo[x]) : modelo[x]}`;
      })
      .filter((x) => x);

    let cadena = this.filtrosSeleccionados.join("&");

    cadena = cadena.length ? encodeURI("?" + cadena) : "";
    this.cadena.emit(cadena);
  }

  convertirFecha(f: string): string {
    return this.fechaService.fechaParaFiltros(f);
  }

  limpiar() {
    this.form.reset();
    //Para evitar problemas de rendimiento siempre reiniciamos en el periodo
    // y vigencias actuales.
    this.setVigenciaPeriodo(
      this.vigenciaPeriodo.vigencia,
      this.vigenciaPeriodo.periodo
    );

    this.notiService.toast.info("Se reiniciaron los datos del filtro. ");
  }
}
