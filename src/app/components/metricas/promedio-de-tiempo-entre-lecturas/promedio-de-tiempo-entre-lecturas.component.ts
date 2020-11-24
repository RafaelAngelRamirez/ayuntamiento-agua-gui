import { Component, OnInit } from "@angular/core";
import { MetricasService } from "../../../services/metricas.service";

@Component({
  selector: "app-promedio-de-tiempo-entre-lecturas",
  templateUrl: "./promedio-de-tiempo-entre-lecturas.component.html",
  styleUrls: ["./promedio-de-tiempo-entre-lecturas.component.css"],
})
export class PromedioDeTiempoEntreLecturasComponent implements OnInit {
  datos: any;
  cargando = false;

  constructor(private metricasServices: MetricasService) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar() {
    this.cargando = true;
    this.metricasServices.promedioDeTiempo().subscribe(
      (datos: any) => {
        this.datos = datos;
        this.cargando = false;
        
      },
      (_) => (this.cargando = false)
    );
  }
}
