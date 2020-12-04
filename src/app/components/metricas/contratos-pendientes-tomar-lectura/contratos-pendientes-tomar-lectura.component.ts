import { Component, OnInit } from "@angular/core";
import { ChartOptions, ChartType } from "chart.js";
import { Label } from "ng2-charts";
import {
  MetricasService,
  ContratosPendientesPorTomarLectura,
} from "../../../services/metricas.service";
import * as outLabels from "chartjs-plugin-piechart-outlabels";
@Component({
  selector: "app-contratos-pendientes-tomar-lectura",
  templateUrl: "./contratos-pendientes-tomar-lectura.component.html",
  styleUrls: ["./contratos-pendientes-tomar-lectura.component.css"],
})
export class ContratosPendientesTomarLecturaComponent implements OnInit {
  cargando = false;
  datos!: ContratosPendientesPorTomarLectura;
  leyenda = "";
  constructor(private metricasService: MetricasService) {}

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
  chartPlugins = [outLabels];

  ngOnInit(): void {
    this.cargar();
  }

  cargar() {
    this.cargando = true;
    this.metricasService.contratosPendientesTomarLectura().subscribe(
      (datos) => {
        this.datos = datos;
        this.cargando = false;
        this.graficaRutas();
      },
      (_) => (this.cargando = false)
    );
  }

  graficaRutas() {
    this.leyenda = "Contratos por ruta";

    this.chartLabels = this.obtenerEtiquetasRutas(this.datos);

    this.chartData = this.datos.rutasEnElSistema.map((x) => x.total);
    this.chartType = "pie";
    this.chartLegend = true;
  }

  obtenerEtiquetasRutas(datos: ContratosPendientesPorTomarLectura) {
    return datos.rutasEnElSistema.map((x) => x._id);
  }

  graficaRutasConLecturasPendientes() {
    this.leyenda = "Rutas con contratos sin tomar lectura";

    this.chartLabels = this.datos.rutasPedientesPorTomarLectura.map(
      (x) => x._id
    );

    this.chartData = this.datos.rutasPedientesPorTomarLectura.map(
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
