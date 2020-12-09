import { Component, OnInit } from "@angular/core";
import { ChartOptions, ChartType } from "chart.js";
import { Label } from "ng2-charts";
import { ChartPluginsService } from "../../../services/chart-plugins.service";
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
    private chartPluginsServic: ChartPluginsService,
    private metricasService: MetricasService
  ) {}

  chartOptions: ChartOptions = {
    responsive: true,
    layout: {
      padding: 130,
    },
    legend: {
      position: "right",
      display: true,
      labels: {
        fontColor: "#555",
      },
    },
  };
  chartLabels: string[] = [];
  chartData: number[] = [];
  chartType: ChartType = "pie";
  chartLegend = true;
  chartColors = [];
  chartPlugins = [this.chartPluginsServic.outLabels];

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

  graficaRutas(datos:ContratosPendientesPorTomarLectura) {
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

    this.chartLabels = datos.rutasPedientesPorTomarLectura.map(
      (x) => x._id
    );

    this.chartData = datos.rutasPedientesPorTomarLectura.map(
      (x) => x.contratos.length
    );
    this.chartType = "doughnut";
    this.chartLegend = true;
  }

  obtenerFaltantesLectura(id: string): number {
    let d = this.datos.rutasPedientesPorTomarLectura.find((x) => x._id === id);

    return d ? d.contratos.length : 0;
  }
}
