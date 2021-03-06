import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { Router } from "@angular/router";
import { Contrato } from "app/services/contrato.service";
import { ImprimirService } from "app/services/imprimir.service";
import { DomicilioPipe } from "../../pipes/domicilio.pipe";
import { UsuarioService } from "../../services/usuario.service";
import { ParametrosService } from "../../services/parametros.service";
import { PeriodoAMesesService } from "../../services/periodo-ameses.service";
import { DecimalPipe, CurrencyPipe, Location } from "@angular/common";
import { Lectura } from "../../services/contrato.service";
import { CalculosTicketService } from "../../services/calculos-ticket.service";
import { Lecturista } from "../../models/usuario.model";
import { NotificacionesService } from "../../services/notificaciones.service";
import {
  IncidenciaService,
  Incidencia,
} from "../../services/incidencia.service";
import {
  ImpedimentoService,
  Impedimento,
} from "../../services/impedimento.service";

@Component({
  selector: "app-ticket-imprimir",
  templateUrl: "./ticket-imprimir.component.html",
  styleUrls: ["./ticket-imprimir.component.css"],
})
export class TicketImprimirComponent implements OnInit {
  _contrato!: Contrato;
  lecturista!: Lecturista;
  @Input() set contrato(c: Contrato) {
    this._contrato = c;
    this.definirContrato(c);
  }

  @Output() paraTicket = new EventEmitter<any>();

  get contrato(): Contrato {
    return this._contrato;
  }

  incidencias: Incidencia[] = [];
  impedimentos: Impedimento[] = [];

  datos: any = {};

  constructor(
    private location: Location,
    private notiService: NotificacionesService,
    private calculosTicketService: CalculosTicketService,
    private parametrosSerivce: ParametrosService,
    private usuarioService: UsuarioService,
    private domicilioPipe: DomicilioPipe,
    private imprimirService: ImprimirService,
    private router: Router,
    private pMesesService: PeriodoAMesesService,
    private decimalPipe: DecimalPipe,
    private currencyPipe: CurrencyPipe,
    public incidenciaService: IncidenciaService,
    public impedimentoService: ImpedimentoService
  ) {}

  ngOnInit(): void {
    this.imprimirService.actualizar.subscribe((contrato) => {
      if (contrato) this.definirContrato(contrato);
    });

    // Se cargan las incidencias.
    this.incidenciaService.offline
      .findAll()
      .subscribe(
        (incidencias: Incidencia[]) => (this.incidencias = incidencias)
      );

    //Se cargan los impedimentos offline.
    this.impedimentoService.offline
      .findAll()
      .subscribe(
        (impedimentos: Impedimento[]) => (this.impedimentos = impedimentos)
      );
  }

  encontrarImpedimento(id: string): string {
    let imp = this.impedimentos.find((x) => x.IdImpedimento === id);
    if (!imp) return "[ IMPEDIMENTO NO REGISTRADO ]";
    return imp.NombreImpedimento;
  }
  encontrarIncidencia(id: string): string {
    let imp = this.incidencias.find((x) => x.IdIncidencia === id);
    if (!imp) return "[ INCIDENCIA NO REGISTRADA ]";
    return imp.NombreIncidencia;
  }

  definirContrato(contrato = this.contrato) {
    // La fecha final
    let ff = new Date();
    // La fecha formateada
    let fText = `${ff.getDate()}/${ff.getMonth() + 1}/${ff.getFullYear()}`;

    let lecturista = this.usuarioService.obtenerUsuario().nombre;

    this.datos["generales"] = {
      Ruta: contrato.IdRuta,
      Fecha: fText,
      Contrato: contrato.Contrato,
      Contribuyente: contrato.Contribuyente,
      Direccion: this.domicilioPipe.transform(contrato),
      Colonia: contrato.Colonia,
      Poblacion: contrato.Poblacion,
      "No. serie del medidor": contrato.SerieMedidor,
      "Tipo de periodo": this.pMesesService.obtenerTipoDePeriodo(
        Number(contrato.TipoPeriodo)
      ),
      "Consumo Promedio": contrato.Promedio,
      Lecturista: lecturista,
    };

    let periodosGenerados = this.calculosTicketService.calcularPeriodo(
      Number(contrato.lectura.Vigencia),
      Number(contrato.lectura.Periodo),
      contrato.VigenciaAnterior,
      Number(contrato.PeriodoAnterior)
    );
    this.datos["lectura"] = {
      "Periodo anterior": this.pMesesService.obtenerNombre(
        Number(contrato.PeriodoAnterior)
      ),
      "Lectura anterior": contrato.LecturaAnterior,
      "Periodo actual": this.pMesesService.obtenerNombre(
        Number(contrato.lectura.Periodo)
      ),
      "Lectura actual": contrato.lectura.LecturaActual,
      "Periodos generados": periodosGenerados,
      "Consumo por periodo": this.hayIncidenciasOImpedimentos(
        contrato,
        (contrato.lectura.LecturaActual - contrato.LecturaAnterior) /
          periodosGenerados
      ),
      "Consumo total": this.hayIncidenciasOImpedimentos(
            contrato,
            contrato.lectura.LecturaActual - contrato.LecturaAnterior
          ),
      "Importe por periodo":this.hayIncidenciasOImpedimentos(
            contrato,
            this.currencyPipe.transform(
              contrato.lectura.importe / periodosGenerados
            )
          ),
      "Importe total": this.hayIncidenciasOImpedimentos(
            contrato,
            this.currencyPipe.transform(contrato.lectura.importe)
          ),
    };

    let saldoAFavor = () => {
      let saldo =  contrato.Saldo;

      let adeudo = contrato.Adeudo;

      let importe = contrato.lectura.importe;

      let r = saldo - adeudo - importe;
      return r > 0 ? r : 0;
    };

    let totalAPagar = 
          contrato.Adeudo + contrato.lectura.importe - contrato.Saldo;
    this.datos["cuenta"] = {
      Importe: this.hayIncidenciasOImpedimentos(
        contrato,
        this.currencyPipe.transform(contrato.lectura.importe)
      ),
      "Adeudo anterior": this.currencyPipe.transform(contrato.Adeudo),

      "Total a pagar": this.hayIncidenciasOImpedimentos(
        contrato,
        this.currencyPipe.transform(totalAPagar < 0 ? 0 : totalAPagar)
      ),
      "Saldo a favor": this.hayIncidenciasOImpedimentos(
            contrato,
            this.currencyPipe.transform(contrato.Saldo)
          ),
      "Nuevo saldo a favor": this.hayIncidenciasOImpedimentos(
        contrato,
        this.currencyPipe.transform(saldoAFavor())
      ),
    };

    this.generarParaImpresion(this.datos, contrato);
  }


  qr = ''

  generarParaImpresion(dato: any, contrato: Contrato) {

    let qr = JSON.stringify({
      contrato:contrato.Contrato,
      totalAPagar:this.datos.cuenta["Total a pagar"],
    })

    this.qr = qr

    setTimeout(() => {
      let paraTicket = {
        ...this.datos.lectura,
        ...this.datos.cuenta,
        ...this.datos.generales,
        problemas: contrato.lectura.problemas
          ? contrato.lectura.problemas
              .concat(" [Observaciones]: ")
              .concat(contrato.lectura.Observaciones?.trim())
          : "",

          qr
      };

      this.paraTicket.emit(paraTicket);
    }, 100);
  }

  retornar() {
    this.router.navigate(["/app/lectura"]);
  }

  hayIncidenciasOImpedimentos(
    contrato: Contrato,
    resultado: number | string | null
  ): number | string | null {
    if (resultado === null) return 0;
    if (
      contrato.lectura.IdIncidencia ||
      contrato.lectura.IdImpedimento ||
      resultado < 0
    )
      return 0;

    return resultado;
  }
}
