import { Component, OnInit } from "@angular/core";
import { Contrato, ContratoService } from "../../../services/contrato.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-contrato-detalle",
  templateUrl: "./contrato-detalle.component.html",
  styleUrls: ["./contrato-detalle.component.css"],
})
export class ContratoDetalleComponent implements OnInit {
  contrato: Contrato | undefined;
  cargando = false;
  constructor(
    private contratoService: ContratoService,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.paramMap.subscribe((ruta) => {
      let numContrato = ruta.get("id");
      if (!numContrato) return;
      
      this.cargando = true;
      this.contratoService.findContrato(numContrato).subscribe(
        (contrato) => {
          this.contrato = contrato;
          this.cargando = false;
        },
        (_) => (this.cargando = false)
      );
    });
  }

  ngOnInit(): void {}
}
