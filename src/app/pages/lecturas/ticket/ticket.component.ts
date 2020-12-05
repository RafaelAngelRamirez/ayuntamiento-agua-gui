import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { Contrato, ContratoService } from "../../../services/contrato.service";
import { NotificacionesService } from "../../../services/notificaciones.service";
import { ImprimirService } from "../../../services/imprimir.service";
import { ZebraService } from "../../../services/zebra/zebra.service";
import { IndexedDbService } from "../../../services/offline/indexed-db.service";
import { UsuarioService } from "../../../services/usuario.service";
import { Usuario } from "../../../models/usuario.model";
import { DomSanitizer } from "@angular/platform-browser";
import { TienePermisoPipe } from "../../../pipes/tiene-permiso.pipe";

@Component({
  selector: "app-ticket",
  templateUrl: "./ticket.component.html",
  styleUrls: ["./ticket.component.css"],
})
export class TicketComponent implements OnInit {
  contrato!: Contrato;
  constructor(
    private usuarioSerivce: UsuarioService,
    private contratoService: ContratoService,
    private imprimirService: ImprimirService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    public zebraService: ZebraService,
    public sanitization: DomSanitizer,
    private tienePermiso: TienePermisoPipe
  ) {}

  zpl_code: string = "";
  listoParaImprimir = false;
  private _datosAImprimir: any = {};
  usuario: Usuario = this.usuarioSerivce.obtenerUsuario();

  set datosAImprimir(d: any) {
    this._datosAImprimir = d;

    this.zpl_code = this.imprimirService.remplazarVariablesZPL(d)
    this.listoParaImprimir = true;
    
  }

  get datosAImprimir(): any {
    return this._datosAImprimir;
  }

  cargandoContrato = false;
  datos: any = {};
  ngOnInit(): void {
    this.cargaContrato();
    // this.zebraService.setup();
  }

  cargaContrato() {
    let error = (_: any) => {
      this.cargandoContrato = false;
      this.location.back();
    };

    this.activatedRoute.paramMap.subscribe((dato) => {
      let conPara: string = dato.get("contrato") || "";
      this.cargandoContrato = true;

      let resultado = (contrato: Contrato) => {
        this.contrato = contrato as Contrato;
        this.cargandoContrato = false;
      };

      if (this.tienePermiso.transform("administrador")) {
        this.contratoService.findContrato(conPara).subscribe(resultado, error);
      } else {
        this.contratoService.offline
          .findById(conPara)
          .subscribe(resultado, error);
      }
    }, error);
  }



   

  imprimir() {
    if (this.cargandoContrato) return;

    this.imprimirService.ticket(this.zpl_code);
  }
}
