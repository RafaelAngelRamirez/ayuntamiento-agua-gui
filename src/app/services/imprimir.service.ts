import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { Contrato } from "./contrato.service";
import { ZebraService } from "./zebra/zebra.service";
import { UsuarioService } from "./usuario.service";
import { NotificacionesService } from "./notificaciones.service";

@Injectable({
  providedIn: "root",
})
export class ImprimirService {
  private _imprimiendo = false;

  actualizar = new BehaviorSubject<Contrato | undefined>(undefined);

  get imprimiendo() {
    return this._imprimiendo;
  }

  constructor(
    private router: Router,
    private zebraService: ZebraService,
    private usuarioService: UsuarioService,
    private notiService: NotificacionesService
  ) {}

  ticket(zpl: string) {
    this._imprimiendo = true;

    let dispositivo = this.usuarioService.obtenerUsuario().dispositivo;

    let uid = this.zebraService.selected_device?.uid;

    if (uid !== dispositivo) {
      this.notiService.toast.error(
        "Imposible imprimir. El dispositivo no corresponde al usuario."
      );
    } else {
      this.zebraService.writeToSelectedPrinter(zpl);
    }
  }

  ticket1 = `
  ^XA
  ~TA000
  ~JSN
  ^LT0
  ^MNW
  ^MTD
  ^PON
  ^PMN
  ^LH0,0
  ^JMA
  ^PR4,4
  ~SD15
  ^JUS
  ^LRN
  ^CI27
  ^PA0,1,1,0
  ^XZ
  ^XA
  ^MMT
  ^PW575
  ^LL1439
  ^LS0
  ^FT331,1082^BQN,2,10
  ^FH\^FDLA,123456789012^FS
  ^FT142,67^A0N,22,18^FB379,1,6,C^FH\^CI28^FDH. AYUNTAMIENTO DE ZAPOTLANEJO^FS^CI27
  ^FT142,89^A0N,22,18^FB379,1,6,C^FH\^CI28^FDDIRECCION DE AGUA POTABLE Y ALCANTARILLADO^FS^CI27
  ^FO11,8^GFA,661,1808,16,:Z64:eJy91DFu5CAUBmAsF5S+wXIUrrVFJEZKsWWOkKOE1RQpc4SxNIVLs5piPDLxnwcPMPbOZjfNUlj69Gz884wRIoy2F5vxN0v3nw342gpYPrP53X7nqTYA91n9zvOb+XXtb5zneyly/8oE2grlRVvboHbfAAdZrFxL7qbKi7a1JVRl7SWuVpfnje8Aq3PAFkuH2WpYtmQb9OwuGGRXLHduN/4VrZ+S28mH/LpL8ze3pQn3nw7cHQL1u6dbPK+eTJMB3AH9M9Yn4JF9BhrM5Ff2QHfG+tWn1lOz43U1j7tWqydeThmO26F6RSU5cUPaaBdsszWVcl1C9xjInt3BOAwhE89HPrMNezFXXGNmtjf89uKU2O/rij3luM8pbxzjmj+O8MaUf2afssMIAfJ6GMUDLvFpDOwrnI6TjndNnzMZhy/4mE3f2hk5NpXz4P3D+UH5k4/s47/6HHqJ4ZXdrD7szOubL+y33B82kmkv0s7bOtZPOX8xv1/RTiCP+USh/8dEp/9Fgu/P/99X3Wbb4mHnx9rh53zY2kZz/PABer/1HJ0YD0dVHXjmgqnDWKzf0bd4Wc+ztJ+zFXv6o18C31c/Q3vcancOt/V8e6JocOX9+EHR6YAReX1tsM3raRYRLEy2JwgjdPQHMVsC1Q==:306C
  ^FT38,218^A0N,23,20^FB196,1,6,R^FH\^CI28^FDRuta:^FS^CI27
  ^FT38,244^A0N,23,20^FB196,1,6,R^FH\^CI28^FDFecha:^FS^CI27
  ^FT38,270^A0N,23,20^FB196,1,6,R^FH\^CI28^FDContrato:^FS^CI27
  ^FT38,296^A0N,23,20^FB196,1,6,R^FH\^CI28^FDContribuyente:^FS^CI27
  ^FT38,322^A0N,23,20^FB196,1,6,R^FH\^CI28^FDDireccion:^FS^CI27
  ^FT38,348^A0N,23,20^FB196,1,6,R^FH\^CI28^FDColonia:^FS^CI27
  ^FT38,375^A0N,23,20^FB196,1,6,R^FH\^CI28^FDPoblacion:^FS^CI27
  ^FT38,401^A0N,23,20^FB196,1,6,R^FH\^CI28^FDTipo de periodo:^FS^CI27
  ^FT38,427^A0N,23,20^FB196,1,6,R^FH\^CI28^FDConsumo Promedio:^FS^CI27
  ^FT38,453^A0N,23,20^FB196,1,6,R^FH\^CI28^FDLecturista:^FS^CI27
  ^FT38,479^A0N,23,20^FB196,1,6,R^FH\^CI28^FDNo. serie del medidor:^FS^CI27
  ^FT38,164^A0N,23,23^FH\^CI28^FDDATOS GENERALES^FS^CI27
  ^FT28,618^A0N,23,23^FB212,1,6,R^FH\^CI28^FDConsumo por periodo:^FS^CI27
  ^FT28,644^A0N,23,23^FB212,1,6,R^FH\^CI28^FDConsumo total:^FS^CI27
  ^FT28,670^A0N,23,23^FB212,1,6,R^FH\^CI28^FDImporte por periodo:^FS^CI27
  ^FT28,696^A0N,23,23^FB212,1,6,R^FH\^CI28^FDImporte total:^FS^CI27
  ^FT28,722^A0N,23,23^FB212,1,6,R^FH\^CI28^FDLectura actual:^FS^CI27
  ^FT28,748^A0N,23,23^FB212,1,6,R^FH\^CI28^FDLectura anterior:^FS^CI27
  ^FT28,775^A0N,23,23^FB212,1,6,R^FH\^CI28^FDPeriodo actual:^FS^CI27
  ^FT28,801^A0N,23,23^FB212,1,6,R^FH\^CI28^FDPeriodo anterior:^FS^CI27
  ^FT28,827^A0N,23,23^FB212,1,6,R^FH\^CI28^FDPeriodos generados:^FS^CI27
  ^FT38,573^A0N,23,23^FH\^CI28^FDDATOS DE LA LECTURA^FS^CI27
  ^FO28,172^GB530,0,3^FS
  ^FO32,575^GB526,0,3^FS
  ^FT28,982^A0N,28,23^FH\^CI28^FDAdeudo anterior:	@$@Adeudo anterior@$@^FS^CI27
  ^FT28,1011^A0N,28,23^FH\^CI28^FDImporte:	@$@Importe@$@^FS^CI27
  ^FT28,1040^A0N,28,23^FH\^CI28^FDSaldo a favor:	@$@Saldo a favor@$@^FS^CI27
  ^FT32,935^A0N,33,33^FH\^CI28^FDESTADO DE CUENTA^FS^CI27
  ^FO21,1170^GB539,0,3^FS
  ^FT94,1214^A0N,36,23^FH\^CI28^FDUNA VEZ QUE CARGES TU PROPIA AGUA,^FS^CI27
  ^FT94,1259^A0N,36,23^FH\^CI28^FD APRENDERAS EL VALOR DE CADA GOTA^FS^CI27
  ^FT38,1309^A0N,23,15^FB503,1,6,C^FH\^CI28^FDSirva de realizar el pago de este comprobante a partir del siguiente dia habil ^FS^CI27
  ^FT38,1338^A0N,23,15^FB503,1,6,C^FH\^CI28^FDde la fecha que señala este recibo. Despues de 4 meses de adeudo se ^FS^CI27
  ^FT38,1367^A0N,23,15^FB503,1,6,C^FH\^CI28^FDaplicara sanción de acuerdo con el Art. 72, Fracc. IV, Inc. F de la ley de^FS^CI27
  ^FT38,1396^A0N,23,15^FB503,1,6,C^FH\^CI28^FD ingresos municipales.^FS^CI27
  ^FT274,214^A0N,23,20^FH\^CI28^FD@$@Ruta@$@^FS^CI27
  ^FT274,240^A0N,23,20^FH\^CI28^FD@$@Fecha@$@^FS^CI27
  ^FT274,266^A0N,23,20^FH\^CI28^FD@$@Contrato@$@^FS^CI27
  ^FT274,292^A0N,23,20^FH\^CI28^FD@$@Contribuyente@$@^FS^CI27
  ^FT274,318^A0N,23,20^FH\^CI28^FD@$@Direccion@$@^FS^CI27
  ^FT274,344^A0N,23,20^FH\^CI28^FD@$@Colonia@$@^FS^CI27
  ^FT274,371^A0N,23,20^FH\^CI28^FD@$@Poblacion@$@^FS^CI27
  ^FT274,397^A0N,23,20^FH\^CI28^FD@$@Tipo de periodo@$@ ^FS^CI27
  ^FT274,423^A0N,23,20^FH\^CI28^FD@$@Consumo Promedio@$@^FS^CI27
  ^FT274,449^A0N,23,20^FH\^CI28^FD@$@Lecturista@$@^FS^CI27
  ^FT274,475^A0N,23,20^FH\^CI28^FD@$@No. serie del medidor@$@^FS^CI27
  ^FT262,618^A0N,23,23^FH\^CI28^FD@$@Consumo por periodo@$@^FS^CI27
  ^FT262,644^A0N,23,23^FH\^CI28^FD@$@Consumo total@$@^FS^CI27
  ^FT262,670^A0N,23,23^FH\^CI28^FD@$@Importe por periodo@$@^FS^CI27
  ^FT262,696^A0N,23,23^FH\^CI28^FD@$@Importe total@$@^FS^CI27
  ^FT262,722^A0N,23,23^FH\^CI28^FD@$@Lectura actual@$@^FS^CI27
  ^FT262,748^A0N,23,23^FH\^CI28^FD@$@Lectura anterior@$@^FS^CI27
  ^FT262,775^A0N,23,23^FH\^CI28^FD@$@Periodo actual@$@^FS^CI27
  ^FT262,801^A0N,23,23^FH\^CI28^FD@$@Periodo anterior@$@^FS^CI27
  ^FT262,827^A0N,23,23^FH\^CI28^FD@$@Periodos generados@$@^FS^CI27
  ^FT32,1112^A0N,31,25^FB218,1,8,R^FH\^CI28^FDTOTAL A PAGAR:^FS^CI27
  ^FT32,1145^A0N,31,25^FB218,1,8,R^FH\^CI28^FDNuevo saldo a favor:^FS^CI27
  ^FT268,1112^A0N,31,25^FH\^CI28^FD@$@Total a pagar@$@^FS^CI27
  ^FT268,1145^A0N,31,25^FH\^CI28^FD@$@Nuevo saldo a favor@$@^FS^CI27
  ^LRY^FO15,898^GB302,0,48^FS^LRN
  ^LRY^FO21,1070^GB542,0,94^FS^LRN
  ^PQ1,0,1,Y
  ^XZ
  
`;
}
