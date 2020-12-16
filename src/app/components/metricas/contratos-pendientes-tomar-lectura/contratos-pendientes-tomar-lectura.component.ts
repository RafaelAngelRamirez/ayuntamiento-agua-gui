import { Component, OnInit } from "@angular/core";
import { ChartOptions, ChartType } from "chart.js";
import { Label } from "ng2-charts";
import { ChartPluginsService } from "../../../services/chart-plugins.service";
import { ExcelService } from "../../../service/excel.service";
import {
  MetricasService,
  ContratosPendientesPorTomarLectura,
} from "../../../services/metricas.service";
@Component({
  selector: "app-contratos-pendientes-tomar-lectura",
  templateUrl: "./contratos-pendientes-tomar-lectura.component.html",
  styleUrls: ["./contratos-pendientes-tomar-lectura.component.css"],
})
export class ContratosPendientesTomarLecturaComponent implements OnInit {
  cargando = false;
  datos!: ContratosPendientesPorTomarLectura;
  leyenda = "";
  constructor(
    private excelService: ExcelService,
    private chartPluginsServic: ChartPluginsService,
    private metricasService: MetricasService
  ) {}

  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,

    layout: {
      // padding: { top: 130 },
      // margin: { top: 130 },
    },
    legend: {
      fullWidth: true,
      position: "bottom",
      display: true,
      labels: {
        fontColor: "#555",
        usePointStyle: true,
      },
    },
  };
  chartLabels: string[] = [];
  chartData: number[] = [];
  chartType: ChartType = "pie";
  chartLegend = true;
  chartColors = [];
  // chartPlugins = [this.chartPluginsServic.outLabels];

  ngOnInit(): void {
    this.cargar();
  }

  cargar() {
    this.cargando = true;
    this.metricasService.contratosPendientesTomarLectura().subscribe(
      (datos) => {
        this.datos = datos;
        this.cargando = false;
        this.graficaRutas(datos);
      },
      (_) => (this.cargando = false)
    );
  }

  graficaRutas(datos: ContratosPendientesPorTomarLectura) {
    this.leyenda = "Contratos por ruta";

    this.chartLabels = this.obtenerEtiquetasRutas(datos);

    this.chartData = this.datos.rutasEnElSistema.map((x) => x.total);
    this.chartType = "pie";
    this.chartLegend = true;
  }

  obtenerEtiquetasRutas(datos: ContratosPendientesPorTomarLectura) {
    return datos.rutasEnElSistema.map((x) => x._id);
  }

  graficaRutasConLecturasPendientes(datos: ContratosPendientesPorTomarLectura) {
    this.leyenda = "Rutas con contratos sin tomar lectura";

    this.chartLabels = datos.rutasPedientesPorTomarLectura.map((x) => x._id);

    this.chartData = datos.rutasPedientesPorTomarLectura.map(
      (x) => x.contratos.length / this.obtenerFaltantesLectura(x._id, datos)
    );
    this.chartType = "pie";
    this.chartLegend = true;
  }

  obtenerFaltantesLectura(
    id: string,
    datos: ContratosPendientesPorTomarLectura
  ): number {
    let d = datos.rutasPedientesPorTomarLectura.find((x) => x._id === id);

    return d ? d.contratos.length : 0;
  }

  rutaRecibeLectura(
    id: string,
    datos: ContratosPendientesPorTomarLectura
  ): boolean {
    let d = datos.rutasPedientesPorTomarLectura.find((x) => x._id === id);
    if (d) return true;
    return false;
  }

  excelRutasEnElSistema(datos: ContratosPendientesPorTomarLectura) {
    this.excelService.exportAsExcelFile(
      datos.rutasEnElSistema,
      "RUTAS_EN_EL_SISTEMA"
    );
  }

  excelRutasPendientesPorTomarLectura(
    datos: ContratosPendientesPorTomarLectura
  ) {
    let datosOrdenados = datos.rutasPedientesPorTomarLectura.reduce(
      (previus, current) => {
        let id = current._id;
        let nuevos: any = current.contratos.map((x) => {
          return {
            contrato: x,
            ruta: id,
          };
        });

        return previus.concat(nuevos);
      },
      []
    );

    this.excelService.exportAsExcelFile(
      datosOrdenados,
      "RUTAS_PENDIENTES_TOMAR_LECTURA"
    );
  }
}
