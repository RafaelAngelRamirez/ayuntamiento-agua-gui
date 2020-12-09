import { Component, OnInit } from "@angular/core";
import { ChartOptions, ChartType } from "chart.js";
import {
  LecturasAnormales,
  MetricasService,
} from "../../../services/metricas.service";

import { ParametrosService } from "../../../services/parametros.service";
import { ChartPluginsService } from "../../../services/chart-plugins.service";
import {
  IncidenciaService,
  Incidencia,
} from "../../../services/incidencia.service";
import {
  ImpedimentoService,
  Impedimento,
} from "../../../services/impedimento.service";

@Component({
  selector: "app-lecturas-anormales",
  templateUrl: "./lecturas-anormales.component.html",
  styleUrls: ["./lecturas-anormales.component.css"],
})
export class LecturasAnormalesComponent implements OnInit {
  leyenda = "Lecturas anormales";
  datos: LecturasAnormales | undefined;
  cargando = false;
  advertencias = "";

  impedimentos: Impedimento[] = [];
  incidencias: Incidencia[] = [];

  chartOptions: ChartOptions = {
    responsive: true,
    layout: {
      padding: 50,
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
  chartPlugins = [this.chartPluginsService.outLabels];

  constructor(
    private chartPluginsService: ChartPluginsService,
    private parametroService: ParametrosService,
    private incidenciasService: IncidenciaService,
    private impedimentoService: ImpedimentoService,
    private metricasService: MetricasService
  ) {}

  ngOnInit(): void {
    this.cargar();
    this.cargarIncidencias();
    this.cargarImpedimentos();
  }

  cargarIncidencias() {
    this.incidenciasService
      .findAll()
      .subscribe((incidencias) => (this.incidencias = incidencias));
  }

  cargarImpedimentos() {
    this.impedimentoService.findAll().subscribe((impedimentos) => {
      this.impedimentos = impedimentos;
    });
  }

  cargar() {
    this.cargando = true;

    this.metricasService.lecturasAnormales().subscribe(
      (datos) => {
        this.datos = datos;
        this.graficaFueraDePromedio(this.datos);
        this.cargando = false;
      },
      (_) => (this.cargando = false)
    );
  }

  obtenerIncidencia(id: string): string {
    let i = this.incidencias.find((x) => x.IdIncidencia === id);
    return i ? i.NombreIncidencia : "";
  }
  obtenerImpedimento(id: string): string {
    let i = this.impedimentos.find((x) => x.IdImpedimento === id);
    return i ? i.NombreImpedimento : "";
  }

  graficaIncidencias(datos: LecturasAnormales | undefined) {
    if (!datos) return;
    this.leyenda = "Lecturas anormales [ Incindencias ]";
    this.advertencias = "Lecturas con incidencias registradas";
    this.chartLabels = datos.incidencias.map((x) =>
      this.obtenerIncidencia(x._id)
    );
    this.chartData = datos.incidencias.map((x) => x.total);
  }

  graficaImpedimentos(datos: LecturasAnormales | undefined) {
    if (!datos) return;
    this.leyenda = "Lecturas anormales [ Impedimentos ]";
    this.advertencias = "Lecturas con impedimentos registrados";
    this.chartLabels = datos.impedimentos.map((x) =>
      this.obtenerImpedimento(x._id)
    );
    this.chartData = datos.impedimentos.map((x) => x.total);
  }
  graficaFueraDePromedio(datos: LecturasAnormales | undefined) {
    if (!datos) return;
    this.leyenda = "Lecturas anormales [ Fuera de promedio ]";
    this.advertencias =
      "Lecturas que se generaron por arriba del promedio definido en el contrato";
    this.chartLabels = datos.fueraDePromedio.map((x) => x._id);
    this.chartData = datos.fueraDePromedio.map((x) => x.total);
  }
}
