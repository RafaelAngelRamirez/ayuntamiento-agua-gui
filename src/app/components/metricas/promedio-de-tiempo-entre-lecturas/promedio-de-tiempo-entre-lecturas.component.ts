import { stringify } from "@angular/compiler/src/util";
import { Component, OnInit } from "@angular/core";
import { MetricasService } from "../../../services/metricas.service";
import { ParametrosService } from "../../../services/parametros.service";
import { Lecturista } from "../../../models/usuario.model";
import { ExcelService } from "../../../service/excel.service";
import { FechaService, FechaDesglosada } from "../../../services/fecha.service";

@Component({
  selector: "app-promedio-de-tiempo-entre-lecturas",
  templateUrl: "./promedio-de-tiempo-entre-lecturas.component.html",
  styleUrls: ["./promedio-de-tiempo-entre-lecturas.component.css"],
})
export class PromedioDeTiempoEntreLecturasComponent implements OnInit {
  datos: any;
  cargando = false;

  constructor(
    private fechaService: FechaService,
    private excelSerivce: ExcelService,
    private metricasServices: MetricasService,
    private ParametrosService: ParametrosService
  ) {}

  chartLabels: string[] = [];
  chartData: any[] = [];
  chartOptions = {};

  chartColors: Array<object> = [];
  chartLegend = true;
  chartType = "bar";

  tituloGrafica: string = "...";
  notas: string = "";
  lecturistas: Lecturista[] = [];

  cadenaBusqueda: string = "";
  ngOnInit(): void {
    this.obtenerUsuariosSimapa();

    let intervalo = setInterval(() => {
      if (this.cadenaBusqueda !== "") {
        clearInterval(intervalo);
        this.cargar(this.cadenaBusqueda);
      }
    }, 100);
  }

  obtenerUsuariosSimapa() {
    this.ParametrosService.obtenerUsuariosSimapa().subscribe((lecturistas) => {
      this.lecturistas = lecturistas;
    });
  }

  cargar(cadena: string) {
    this.cargando = true;
    this.metricasServices.promedioDeTiempo(cadena).subscribe(
      (datos: any) => {
        this.datos = datos;
        this.graficaPromedioDeTiempoEntreLecturas(datos);
        this.cargando = false;
      },
      (_: any) => (this.cargando = false)
    );
  }

  graficaPromedioDeTiempoEntreLecturas(datos: any) {
    this.tituloGrafica = "Promedio de tiempo entre lecturas";
    this.chartLabels = this.obtenerEtiquetasPromedio(datos);
    this.chartData = this.obtenerDatosPromedio(datos, this.chartLabels);
    this.chartType = "line";
    this.notas =
      "El promedio se obtiene solo de los dias en los que se tomaron lecturas";
    this.chartOptions = {
      scales: {
        // yAxes: [
        //   {
        //     ticks: {
        //       beginAtZero: true,
        //     },
        //     // gridLines: {
        //     //   color: "rgba(120, 130, 140, 0.13)",
        //     // },
        //   },
        // ],
        xAxes: [
          {
            gridLines: {
              color: "rgba(120, 130, 140, 0.13)",
            },
          },
        ],
      },
      responsive: true,
      maintainAspectRatio: false,
    };

    this.chartColors = [
      // {
      //   // grey
      //   backgroundColor: "rgba(6,215,156,0.1)",
      //   borderColor: "rgba(6,215,156,1)",
      //   pointBackgroundColor: "rgba(6,215,156,1)",
      //   pointBorderColor: "#fff",
      //   pointHoverBackgroundColor: "#fff",
      //   pointHoverBorderColor: "rgba(6,215,156,0.5)",
      // },
      // {
      //   // dark grey
      //   backgroundColor: "rgba(57,139,247,0.2)",
      //   borderColor: "rgba(57,139,247,1)",
      //   pointBackgroundColor: "rgba(57,139,247,1)",
      //   pointBorderColor: "#fff",
      //   pointHoverBackgroundColor: "#fff",
      //   pointHoverBorderColor: "rgba(57,139,247,0.5)",
      // },
    ];
  }

  obtenerDatosPromedio(datos: any, labels: string[]) {
    let dataSet: { data: number[]; label: string }[] = [];
    // Obtenemos los lecturistas
    Object.keys(datos).forEach((x) => {
      let d = { data: new Array(), label: this.nombreLecturista(x) };

      labels.forEach((l) => {
        let incluyeDia = Object.keys(datos[x]).includes(l);

        if (incluyeDia) {
          // Dos decimales
          let valor = parseFloat(datos[x][l + "-promedio"] + "").toFixed(2);

          d.data.push(valor);
        } else {
          d.data.push(0);
        }
      });

      dataSet.push(d);
    });

    return dataSet;
  }

  private getDates(startDate: Date, stopDate: Date) {
    var dateArray: Date[] = new Array();
    var currentDate = startDate;
    while (currentDate <= stopDate) {
      dateArray.push(new Date(currentDate));
      currentDate = this.addDays(currentDate, 1);
    }
    return dateArray;
  }

  private addDays(currentDate: Date, days: number) {
    var date = new Date(currentDate);
    date.setDate(date.getDate() + days);
    return date;
  }

  obtenerEtiquetasPromedio(datos: any) {
    let dias: string[] = [];
    Object.keys(datos).forEach((a) => dias.push(...Object.keys(datos[a])));
    dias = Array.from(new Set(dias)).filter((x) => !x.includes("-promedio"));
    dias.sort((a, b) => {
      return new Date(a).getTime() - new Date(b).getTime();
    });

    let startDate = dias.shift() || new Date();
    let stopDate = dias.pop() || new Date();

    return this.getDates(new Date(startDate), new Date(stopDate)).map((x) => {
      let d = x.getDate();
      let m = x.getMonth() + 1;
      let y = x.getFullYear();
      // El orden de la fecha en la etiqueta es importante.
      return `${y}-${m < 10 ? "0" + m : m}-${d < 10 ? "0" + d : d}`;
    });
  }

  graficaContratosPorLecturista(datos: any) {
    this.tituloGrafica = "Contratos por lecturista";
    this.chartLabels = this.obtenerEtiquetasContrato(datos);
    this.chartData = this.obtenerDatosContrato(datos, this.chartLabels);
    this.chartType = "bar";
    this.chartOptions = {
      scales: {
        // yAxes: [
        //   {
        //     ticks: {
        //       beginAtZero: true,
        //     },
        //     gridLines: {
        //       color: "rgba(120, 130, 140, 0.13)",
        //     },
        //   },
        // ],
        xAxes: [
          {
            gridLines: {
              color: "rgba(120, 130, 140, 0.13)",
            },
          },
        ],
      },
      responsive: true,
      maintainAspectRatio: false,
    };

    this.chartColors = [
      // {
      //   // grey
      //   backgroundColor: "rgba(6,215,156,0.1)",
      //   borderColor: "rgba(6,215,156,1)",
      //   pointBackgroundColor: "rgba(6,215,156,1)",
      //   pointBorderColor: "#fff",
      //   pointHoverBackgroundColor: "#fff",
      //   pointHoverBorderColor: "rgba(6,215,156,0.5)",
      // },
      // {
      //   // dark grey
      //   backgroundColor: "rgba(57,139,247,0.2)",
      //   borderColor: "rgba(57,139,247,1)",
      //   pointBackgroundColor: "rgba(57,139,247,1)",
      //   pointBorderColor: "#fff",
      //   pointHoverBackgroundColor: "#fff",
      //   pointHoverBorderColor: "rgba(57,139,247,0.5)",
      // },
    ];
  }

  obtenerEtiquetasContrato(datos: any): string[] {
    return this.obtenerEtiquetasPromedio(datos);
  }

  obtenerDatosContrato(datos: any, labels: string[]): any[] {
    let dataSet: { data: number[]; label: string }[] = [];
    // Obtenemos los lecturistas
    Object.keys(datos).forEach((x) => {
      let d = { data: new Array(), label: this.nombreLecturista(x) };

      labels.forEach((l) => {
        let incluyeDia = Object.keys(datos[x]).includes(l);

        if (incluyeDia) {
          // Dos decimales
          let valor = datos[x][l].length;

          d.data.push(valor);
        } else {
          d.data.push(0);
        }
      });

      dataSet.push(d);
    });

    return dataSet;
  }

  sumaPromedioTiempoEntreLecturas(lecturista: any): number {
    let sumar: number[] = [];
    Object.keys(lecturista).forEach((k) => {
      if (k.includes("-promedio")) {
        sumar.push(lecturista[k]);
      }
    });

    return sumar.reduce((a, b) => a + b, 0) / sumar.length;
  }

  promedioContratosDia(lecturista: any) {
    let sumar: number[] = [];

    Object.keys(lecturista).forEach((k) => {
      // No debe de incluir promedio
      if (!k.includes("-promedio")) sumar.push(lecturista[k].length);
    });

    return sumar.reduce((a, b) => a + b, 0) / sumar.length;
  }
  totalContratos(lecturista: any) {
    let sumar = 0;
    Object.keys(lecturista).forEach((x) => {
      if (!x.includes("-promedio")) sumar += lecturista[x].length;
    });
    return sumar;
  }

  nombreLecturista(id: string): string {
    let nombre = this.lecturistas.find((x) => x.IdLecturista === id)
      ?.NombreLecturista;

    return nombre ? nombre : id;
  }

  exportarExcel(datos: any) {
    let datosTransformados: any[] = [];

    Object.keys(datos).forEach((id) => {
      let lecturista = datos[id];
      Object.keys(lecturista).forEach((dia) => {
        datosTransformados = datosTransformados.concat(lecturista[dia]);
      });
    });

    datosTransformados = datosTransformados.map((x) => {
      let datos: any = {
        fechaLectura: this.fechaService.desgloseDeFecha(x.FechaLectura),
        fechaAnterior: this.fechaService.desgloseDeFecha(x.anterior),
        fechaActual: this.fechaService.desgloseDeFecha(x.actual),
      };

      Object.keys(datos).forEach((x) => {
        datos[x] = this.fechaService.fechaConPrefijo(datos[x], x);
      });

      return {
        ...x,
        ...datos.fechaLectura,
        ...datos.fechaAnterior,
        ...datos.fechaActual,
      };
    });

    this.excelSerivce.exportAsExcelFile(
      datosTransformados,
      "ESTADISTICAS_LECTURISTAS"
    );
  }
}
