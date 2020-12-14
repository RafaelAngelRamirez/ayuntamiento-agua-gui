import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { BehaviorSubject } from "rxjs";
import { PeriodoAMesesService } from "../../../services/periodo-ameses.service";
import { Lecturista } from "../../../models/usuario.model";
import { ParametrosService } from "../../../services/parametros.service";
import { FechaService } from "../../../services/fecha.service";

@Component({
  selector: "app-filtros-metricas",
  templateUrl: "./filtros-metricas.component.html",
  styleUrls: ["./filtros-metricas.component.css"],
})
export class FiltrosMetricasComponent implements OnInit {
  @Output() cadena = new EventEmitter<string>();

  lecturistas: Lecturista[] = [];
  periodos: { periodo: string; valor: number }[] = [];

  constructor(
    private fechaService: FechaService,
    private parametrosService: ParametrosService,
    private periodoAMesesService: PeriodoAMesesService
  ) {}
  form = new FormGroup({
    fechaLimiteInferior: new FormControl(""),
    fechaLimiteSuperior: new FormControl(""),
    vigencia: new FormControl(new Date().getFullYear()),
    periodo: new FormControl(""),
    lecturista: new FormControl(""),
    calle: new FormControl(""),
    colonia: new FormControl(""),
    poblacion: new FormControl(""),
  });

  ngOnInit(): void {
    this.parametrosService.obtenerUsuariosSimapa().subscribe((usa) => {
      this.lecturistas = usa;
    });

    let contador = 0;
    this.periodos = this.periodoAMesesService.equivalencia.map((x) => {
      contador++
      return {
        periodo: x,
        // Los periodos empiezan desde 1
        valor: contador,
      };
    });

    // Emitimos los eventos cuando haya un cambio en el formulario.
    this.form.valueChanges.subscribe((values) => {
      this.submit(values);
    });

    this.parametrosService.cargarPeriodoVigencia().subscribe((datos)=>{
      
      this.form.get("vigencia")?.setValue(datos.vigencia)
      this.form.get("periodo")?.setValue(datos.periodo)

    } )

  }

  submit(modelo: any) {
    // Si es correcto generamos una cadena de texto formateada como
    // parametros de url.

    let cadena = Object.keys(modelo)
      .map((x) => {
        let esFecha = false;
        if (x === "fechaLimiteInferior" || x === "fechaLimiteSuperior")
          esFecha = true;
        //Parametros en nulo no pasan
        if (!modelo[x]) return null;
        return `${x}=${esFecha ? this.convertirFecha(modelo[x]) : modelo[x]}`;
      })
      .filter((x) => x)
      .join("&");

    cadena = encodeURI("?" + cadena);
    console.log(cadena);
    this.cadena.emit(cadena);
  }

  convertirFecha(f: string): string {
    return this.fechaService.fechaParaFiltros(f);
  }

  limpiar() {
    this.form.reset();
  }
}
