import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { IndexedDBService } from "@codice-progressio/indexed-db";
import { Contrato } from "../../../services/contrato.service";
import { NotificacionesService } from "../../../services/notificaciones.service";

@Component({
  selector: "app-ticket",
  templateUrl: "./ticket.component.html",
  styleUrls: ["./ticket.component.css"],
})
export class TicketComponent implements OnInit {
  contrato!: Contrato;
  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private idbService: IndexedDBService,
    private notiService: NotificacionesService
  ) {}

  cargandoContrato = false;

  ngOnInit(): void {
    this.cargaContrato();
  }

  cargaContrato() {
    let error = (_: any) => {
      this.cargandoContrato = false;
      this.location.back();
    };

    this.activatedRoute.paramMap.subscribe((dato) => {
      let conPara: string = dato.get("contrato") || "";
      this.cargandoContrato = true;

      this.idbService.findById(conPara).subscribe((contrato) => {
        this.contrato = contrato as Contrato;
        this.cargandoContrato = false;

        this.notiService.toast.warning("Este demo no permite la impresion");
      }, error);
    }, error);
  }
}
