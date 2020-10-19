import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { Contrato, ContratoService } from "../../../services/contrato.service";
import { NotificacionesService } from "../../../services/notificaciones.service";
import { ImprimirService } from "../../../services/imprimir.service";
import { ZebraService } from "../../../services/zebra/zebra.service";
import { IndexedDbService } from "../../../services/offline/indexed-db.service";

@Component({
  selector: "app-ticket",
  templateUrl: "./ticket.component.html",
  styleUrls: ["./ticket.component.css"],
})
export class TicketComponent implements OnInit {
  contrato!: Contrato;
  constructor(
    private contratoService: ContratoService,
    private imprimirService: ImprimirService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    public zebraService: ZebraService
  ) {}

  cargandoContrato = false;
  datos: any = {};
  ngOnInit(): void {
    this.cargaContrato();
    this.zebraService.setup();
  }

  cargaContrato() {
    let error = (_: any) => {
      this.cargandoContrato = false;
      this.location.back();
    };

    this.activatedRoute.paramMap.subscribe((dato) => {
      let conPara: string = dato.get("contrato") || "";
      this.cargandoContrato = true;

      this.contratoService.offline.findById(conPara).subscribe((contrato) => {
        this.contrato = contrato as Contrato;
        this.cargandoContrato = false;
      }, error);
    }, error);
  }

  imprimir() {
    this.imprimirService.ticket(this.contrato);
  }
}
