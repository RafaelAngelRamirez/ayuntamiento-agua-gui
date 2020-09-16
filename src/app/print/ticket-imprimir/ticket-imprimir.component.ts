import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router"
import { Contrato } from "app/services/contrato.service";
import { ImprimirService } from "app/services/imprimir.service";
import { DomicilioPipe } from "../../pipes/domicilio.pipe";
import { UsuarioService } from "../../services/usuario.service";

@Component({
  selector: "app-ticket-imprimir",
  templateUrl: "./ticket-imprimir.component.html",
  styleUrls: ["./ticket-imprimir.component.css"],
})
export class TicketImprimirComponent implements OnInit {
  _contrato!: Contrato;
  @Input() set contrato(c: Contrato) {
    this._contrato = c;
    this.definirContrato(c);
  }

  get contrato(): Contrato {
    return this._contrato;
  }

  datos: any = {};

  constructor(
    private usuarioService: UsuarioService,
    private domicilioPipe: DomicilioPipe,
    private imprimirService: ImprimirService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.imprimirService.actualizar.subscribe((contrato) => {
      if (contrato) this.definirContrato(contrato);
    });
  }

  definirContrato(contrato = this.contrato) {
    this.datos["generales"] = {
      Contrato: contrato.Contrato,
      Contribuyente: contrato.Contribuyente,
      Direccion: this.domicilioPipe.transform(contrato),
      Colonia: contrato.Colonia,
      Poblacion: contrato.Poblacion,
      "No. serie del medidor": contrato.SerieMedidor,
      "Tipo de periodo": contrato.TipoPeriodo,
      ConsumoPromedio: contrato.Promedio,
      Lecturista: this.usuarioService.obtenerUsuario().nombre,
    };

    this.datos["lectura"] = {
      "Periodo anterior": contrato.PeriodoAnterior,
      "Lectura anterior": contrato.LecturaAnterior,
      "Periodo actual": "SIN DEFINIR PERIODO ACTUAL",
      "Lectura actual": contrato.lectura?.lectura,
      "Periodos generados": "SIND DEFINIR PERIODOS GENERADOS",
      "Consumo por periodo": "SIN DEFINIR CONSUMO POR PERIODO",
      "Consumo total": "SIN DEFINR CONSUMO TOTAL",
      "Importe por periodo": "SIN DEFINIR IMPORTE POR PERIODO",
      "Importe total": "SIN DEFINIR IMPORTE TOTAL",
    };

    this.datos["cuenta"] = {
      "Adeudo anterior": "SIN DEFINIR Adeudo anterior ",
      Importe: "SIN DEFINIR Importe ",
      "Saldo a favor": "SIN DEFINIR Saldo a favor ",
    };
  }

  retornar() {
    this.router.navigate(["/app/lectura"]);
  }
}
