import { Component, OnInit } from "@angular/core";
import { MetricasService } from "../../../services/metricas.service";

@Component({
  selector: "app-total-de-contratos",
  templateUrl: "./total-de-contratos.component.html",
  styleUrls: ["./total-de-contratos.component.css"],
})
export class TotalDeContratosComponent implements OnInit {
  totalContratos = 0;
  cargando = false;

  constructor(private metricasService: MetricasService) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar() {
    this.cargando = true;

    this.metricasService.totalDeContratos().subscribe(
      (total) => {
        this.cargando = false;

        this.totalContratos = total;
      },
      (_) => {
        this.cargando = false;
      }
    );
  }
}
