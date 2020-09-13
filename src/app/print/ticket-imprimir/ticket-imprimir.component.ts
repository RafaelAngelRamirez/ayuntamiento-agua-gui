import { Location } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { IndexedDBService } from "@codice-progressio/indexed-db";
import { Contrato } from "app/services/contrato.service";
import { ImprimirService } from "app/services/imprimir.service";
import { NotificacionesService } from "app/services/notificaciones.service";

@Component({
  selector: "app-ticket-imprimir",
  templateUrl: "./ticket-imprimir.component.html",
  styleUrls: ["./ticket-imprimir.component.css"],
})
export class TicketImprimirComponent implements OnInit {
  _contrato!: Contrato;
  @Input() set contrato(c: Contrato) {
    this._contrato = c;
  }

  get contrato(): Contrato {
    return this._contrato;
  }

  datos: any = {};

  constructor(
    private imprimirService: ImprimirService,
    private idbService: IndexedDBService,
    private notiService: NotificacionesService
  ) {}

  ngOnInit(): void {
    this.definirContrato();
    console.log("Se ejecuta el init");

    this.imprimirService.actualizar.subscribe((x) => {
      if (x) this.definirContrato();
    });
  }

  definirContrato() {
    this.datos["generales"] = {
      Contrato: "",
      Contribuyente: "",
      Direccion: "",
      Colonia: "",
      Poblacion: "",
      "No. serie del medidor": "",
      "Tipo de periodo": "",
      ConsumoPromedio: "",
      Lecturista: "",
    };
    this.datos["lectura"] = {
      "Periodo anterior": "",
      "Lectura anterior": "",
      "Periodo actual": "",
      "Lectura actual": "",
      "Periodos generados": "",
      "Consumo por periodo": "",
      "Consumo total": "",
      "Importe por periodo": "",
      "Importe total": "",
    };
    this.datos["cuenta"] = {
      "Adeudo anterior": "",
      Importe: "",
      "Saldo a favor": "",
    };
  }
}
