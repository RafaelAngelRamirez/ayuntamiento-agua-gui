import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { Router } from "@angular/router";
import { Contrato } from "app/services/contrato.service";
import { ImprimirService } from "app/services/imprimir.service";
import { DomicilioPipe } from "../../pipes/domicilio.pipe";
import { UsuarioService } from "../../services/usuario.service";
import { ParametrosService } from "../../services/parametros.service";
import { PeriodoAMesesService } from "../../services/periodo-ameses.service";
import { DecimalPipe, CurrencyPipe } from "@angular/common";

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

  @Output() paraTicket = new EventEmitter<any>();

  get contrato(): Contrato {
    return this._contrato;
  }

  datos: any = {};

  constructor(
    private parametrosSerivce: ParametrosService,
    private usuarioService: UsuarioService,
    private domicilioPipe: DomicilioPipe,
    private imprimirService: ImprimirService,
    private router: Router,
    private pMesesService: PeriodoAMesesService,
    private decimalPipe: DecimalPipe,
    private currencyPipe: CurrencyPipe
  ) {}

  ngOnInit(): void {
    this.imprimirService.actualizar.subscribe((contrato) => {
      if (contrato) this.definirContrato(contrato);
    });
  }

  definirContrato(contrato = this.contrato) {
    let d = new Date();
    let fecha = `${d.getDay()}/${d.getMonth()}/${d.getFullYear()}`;
    this.datos["generales"] = {
      Ruta: contrato.IdRuta,
      Fecha: fecha,
      Contrato: contrato.Contrato,
      Contribuyente: contrato.Contribuyente,
      Direccion: this.domicilioPipe.transform(contrato),
      Colonia: contrato.Colonia,
      Poblacion: contrato.Poblacion,
      "No. serie del medidor": contrato.SerieMedidor,
      "Tipo de periodo": contrato.TipoPeriodo,
      "Consumo Promedio": contrato.Promedio,
      Lecturista: this.usuarioService.obtenerUsuario().nombre,
    };

    let periodosGenerados =
      Number(contrato.lectura.Periodo) - Number(contrato.PeriodoAnterior);

    this.datos["lectura"] = {
      "Periodo anterior": this.pMesesService.convertir(
        Number(contrato.PeriodoAnterior)
      ),
      "Lectura anterior": contrato.LecturaAnterior,
      "Periodo actual": this.pMesesService.convertir(
        Number(contrato.lectura.Periodo)
      ),
      "Lectura actual": contrato.lectura.LecturaActual,
      "Periodos generados": periodosGenerados,
      "Consumo por periodo":
        (contrato.lectura.LecturaActual - contrato.LecturaAnterior) /
        periodosGenerados,
      "Consumo total":
        contrato.lectura.LecturaActual - contrato.LecturaAnterior,
      "Importe por periodo": this.currencyPipe.transform(
        contrato.lectura.importe / periodosGenerados
      ),
      "Importe total": this.currencyPipe.transform(contrato.lectura.importe),
    };

    let saldos = () => {
      let saldo = contrato.Saldo - contrato.Adeudo - contrato.lectura.importe;
      return saldo > 0 ? saldo : 0;
    };
    this.datos["cuenta"] = {
      Importe: this.currencyPipe.transform(contrato.lectura.importe),
      "Adeudo anterior": this.currencyPipe.transform(contrato.Adeudo),
      "Total a pagar": this.currencyPipe.transform(
        contrato.Adeudo + contrato.lectura.importe - contrato.Saldo
      ),
      "Saldo a favor": this.currencyPipe.transform(contrato.Saldo),
      "Nuevo saldo a favor": this.currencyPipe.transform(saldos()),
    };

    console.log(`this.datos`, this.datos);

    let paraTicket = {
      ...this.datos.lectura,
      ...this.datos.cuenta,
      ...this.datos.generales,
    };

    console.log(`paraTicket`, paraTicket);
    this.paraTicket.emit(paraTicket);
  }

  retornar() {
    this.router.navigate(["/app/lectura"]);
  }
}
