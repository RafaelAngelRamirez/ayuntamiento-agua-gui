import { Component, OnInit } from "@angular/core";
import { MetricasService } from "../../../services/metricas.service";

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
  constructor(private metricasService: MetricasService) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar() {
    this.cargando = true;
    this.metricasService.dineroRecaudado().subscribe(
      (datos: any) => {
        this.datos = datos;
        this.total = datos.recaudacion;
        this.mt3Consumidos = this.obtenerMt3(datos);
        this.cargando = false;
      },
      () => {
        this.cargando = false;
      }
    );
  }

  obtenerMt3(datos: any) {
    return datos.detalles.reduce((a: number, b: any) => a + b.ConsumoMts3, 0);
  }
}
