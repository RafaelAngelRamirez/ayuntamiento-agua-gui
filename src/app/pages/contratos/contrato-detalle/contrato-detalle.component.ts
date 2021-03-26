import { Component, OnInit } from "@angular/core";
import { Contrato, ContratoService } from "../../../services/contrato.service";
import { ActivatedRoute } from "@angular/router";
import { NotificacionesService } from "../../../services/notificaciones.service";

@Component({
  selector: "app-contrato-detalle",
  templateUrl: "./contrato-detalle.component.html",
  styleUrls: ["./contrato-detalle.component.css"],
})
export class ContratoDetalleComponent implements OnInit {
  contrato: Contrato | undefined;
  cargando = false;
  constructor(
    private notiService: NotificacionesService,
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

  volverATomarLectura() {
    if (!this.contrato || this.cargando) return;

    if (!this.contrato.lectura) {
      this.notiService.toast.error("No hay lecturas del periodo");
      return;
    }

    this.notiService.sweet.confirmacion(
      "Vas a borrar la lectura de este periodo y esta acción no se puede deshacer. ¿Estás segúro que quieres continuar?",
      "Eliminar lectura del periodo actual",
      () => {
        this.cargando = true;
        this.contratoService.volverATomarLectura(this.contrato!._id).subscribe(
          (contrato) => {
            this.cargando = false;
            this.contrato = contrato;
          },
          () => (this.cargando = false)
        );
      },
      () => {
        this.notiService.toast.warning("No se realizó ninguna acción");
      }
    );
  }
}
