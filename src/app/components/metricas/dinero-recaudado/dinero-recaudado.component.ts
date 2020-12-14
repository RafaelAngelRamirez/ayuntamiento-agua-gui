import { Component, OnInit } from "@angular/core";
import { MetricasService } from "../../../services/metricas.service";
import { ExcelService } from "../../../service/excel.service";

@Component({
  selector: "app-dinero-recaudado",
  templateUrl: "./dinero-recaudado.component.html",
  styleUrls: ["./dinero-recaudado.component.css"],
})
export class DineroRecaudadoComponent implements OnInit {
  cargando = false;
  total: number = 0;
  datos: any;
  mt3Consumidos: any;

  cadenaBusqueda: string = "";

  constructor(
    private metricasService: MetricasService,
    private excelService: ExcelService
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar() {
    this.cargando = true;
    this.metricasService.dineroRecaudado(this.cadenaBusqueda).subscribe(
      (datos: any) => {
        this.datos = datos;
        this.total = datos.recaudacion;
        this.mt3Consumidos = datos.consumoMt3;
        this.cargando = false;
      },
      () => {
        this.cargando = false;
      }
    );
  }

  exportarExcel(datos: any) {
    this.excelService.exportAsExcelFile(datos.detalles, "RECAUDACION");
  }
}
