import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { Contrato } from "./contrato.service";
import { ZebraService } from "./zebra/zebra.service";
import { UsuarioService } from './usuario.service'
import { NotificacionesService } from "./notificaciones.service";

@Injectable({
  providedIn: "root",
})
export class ImprimirService {
  private _imprimiendo = false;

  /**
   *Despues de hacer el calculo en tickect-imprimir se usa esta propiead
   * para notificar que se realizo el calculo. 
   *
   * @memberof ImprimirService
   */
  actualizar = new BehaviorSubject<Contrato | undefined>(undefined);

  get imprimiendo() {
    return this._imprimiendo;
  }

  constructor(
    private zebraService: ZebraService,
    private UsuarioService: UsuarioService
    
    ) {}

  ticket(zpl: string) {
    
    
    this._imprimiendo = true;
    this.zebraService.writeToSelectedPrinter(zpl);
  }


  remplazarVariablesZPL (datosAImprimir:any ):string{
    let tieneIncidencias = !!datosAImprimir.problemas;

    let zpl = tieneIncidencias
      ? this.ticket_impedimentos
      : this.ticket1;

    let p = "@$@";
    Object.keys(datosAImprimir).forEach((key) => {
      zpl = zpl.replace(`${p}${key}${p}`, datosAImprimir[key]);
    });

    // Sies un usuario iphone tenemos que convertir el codigo zpl en
    // en base 64 para que mobi print funcione.
    // return this.usuario.esIphone ? btoa(zpl) : zpl;
    return zpl
  }

  ticket1 = `
  ^XA
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

  ticket_impedimentos = `
^XA
^FT142,67^A0N,22,18^FB379,1,6,C^FH\^CI28^FDH. AYUNTAMIENTO DE ZAPOTLANEJO^FS^CI27
^FT142,89^A0N,22,18^FB379,1,6,C^FH\^CI28^FDDIRECCION DE AGUA POTABLE Y ALCANTARILLADO^FS^CI27
^FO11,8^GFA,1069,1808,16,:Z64:eJyl1EFrE0EUAOA3DHQ8xI3HKW6zgn8gVdAVQ4MI4sX/0CroRSXFgxVtd5aF9lLSawpV8B9UvFQ8OGFLqhDMtQcPUyL1IOiKlwgx49udnU0bpCDOYdlvh3nz5s3OAPy1ieMk8v9M1ckmk/7H+EzrwVGXJ+wFOjnqubo+NmPN0/Kk/snxGP+Y6YRPzNcxbhTBMH8cXQQoC/CGQAozCbUK0MJTEgYM6PzYZECP2FFkRAQr4jsJ7bVFuWrt+vTrgXB964DTX+iRzVXvE/RZWxHaHpCffeFF1nKJfFmDil0TkT5oB1wq8gDqDAQjOMVsfEysjsGnClfBqYNT+OII6ymDjq3G4xF4iXp6CNkWeuK2A3Ux37hBcisXa9fwmbHbVkugIKmwOFtRCfdGy/SRZE7ftPDSZ1ZBNiBas+ybytJXIFk5AayYWYBkkgUSv9N8eegfAk2yfrLKJG2jkwXjpiMrJPViVhC6VZJ1NN3xjbkrF3BK3XKNfS4/hKlLxlXefn8ga3TsWCyKZ7TlGDd458Ls1uHVsXdhWsc6N0n83ZubX6Je0zrp3HzVj3obG8avVPz+Rz/aizZMvi9FrA8k0LBtHArpElljuaHdQmN+m9ZbskR0pDdjs0FxF92B629y91OrFfY6953UOP7tnvG9IboHP98dGq8sobE+L1Zy+zgfet0a5Bz+W1Tkvgg6a+LhhD9OuJtbSOAc9/OYH4Rh7lnx8RnnQRg2jRdl7zvnOgxXjQ9kL2phf7RmrOReuI/91k/Untjny/1IG9fV7rUWvxWzoXE56Z7H+SKWH1i63a1wvhydlsZkp+vifNGMdesz9gdr09brdy/j/KtXRO7m43st/nt10brzKMb4zQXreDZEr/dzQ7wDfPr383w7cEGfcP36bWQ9P0yti/N5ewV4aXl01/rSZaiWgm/3retUNKa0HFp7oVJMi+KCnZFaEk0Kl1QdYMS2rZ2GBzAoF/fRVA2Pn6qN7QmNw+cLl7dZcjoZm+FBdtXY1AXwx3Yo/gmzsojnErxtAlHcbz7+UjAHrnU1feXpNWzaOTjS/gA/RJ4b:A8BF
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
^FT28,565^A0N,23,23^FB212,1,6,R^FH\^CI28^FDConsumo por periodo:^FS^CI27
^FT28,591^A0N,23,23^FB212,1,6,R^FH\^CI28^FDConsumo total:^FS^CI27
^FT28,617^A0N,23,23^FB212,1,6,R^FH\^CI28^FDImporte por periodo:^FS^CI27
^FT28,643^A0N,23,23^FB212,1,6,R^FH\^CI28^FDImporte total:^FS^CI27
^FT28,669^A0N,23,23^FB212,1,6,R^FH\^CI28^FDLectura actual:^FS^CI27
^FT28,695^A0N,23,23^FB212,1,6,R^FH\^CI28^FDLectura anterior:^FS^CI27
^FT28,722^A0N,23,23^FB212,1,6,R^FH\^CI28^FDPeriodo actual:^FS^CI27
^FT28,748^A0N,23,23^FB212,1,6,R^FH\^CI28^FDPeriodo anterior:^FS^CI27
^FT28,774^A0N,23,23^FB212,1,6,R^FH\^CI28^FDPeriodos generados:^FS^CI27
^FT38,520^A0N,23,23^FH\^CI28^FDDATOS DE LA LECTURA^FS^CI27
^FO28,172^GB530,0,3^FS
^FO32,524^GB526,0,3^FS
^FT63,838^A0N,33,33^FH\^CI28^FDNO PUDIMOS TOMAR LA LECTURA^FS^CI27
^FO21,1170^GB539,0,3^FS
^FT94,1222^A0N,36,23^FH\^CI28^FDUNA VEZ QUE CARGES TU PROPIA AGUA,^FS^CI27
^FT94,1267^A0N,36,23^FH\^CI28^FD APRENDERAS EL VALOR DE CADA GOTA^FS^CI27
^FT38,1309^A0N,23,15^FB503,1,6,C^FH\^CI28^FDSirva de realizar el pago de este comprobante a partir del siguiente dia habil ^FS^CI27
^FT38,1338^A0N,23,15^FB503,1,6,C^FH\^CI28^FDde la fecha que señala este recibo. Despues de 4 meses de adeudo se ^FS^CI27
^FT38,1367^A0N,23,15^FB503,1,6,C^FH\^CI28^FDaplicara sanción de acuerdo con el Art. 72, Fracc. IV, Inc. F de la ley de^FS^CI27
^FT38,1396^A0N,23,15^FB503,1,6,C^FH\^CI28^FD ingresos municipales.^FS^CI27
^FT242,214^A0N,23,20^FH\^CI28^FD@$@Ruta@$@^FS^CI27
^FT242,240^A0N,23,20^FH\^CI28^FD@$@Fecha@$@^FS^CI27
^FT242,266^A0N,23,20^FH\^CI28^FD@$@Contrato@$@^FS^CI27
^FT242,292^A0N,23,20^FH\^CI28^FD@$@Contribuyente@$@^FS^CI27
^FT242,318^A0N,23,20^FH\^CI28^FD@$@Direccion@$@^FS^CI27
^FT242,344^A0N,23,20^FH\^CI28^FD@$@Colonia@$@^FS^CI27
^FT242,371^A0N,23,20^FH\^CI28^FD@$@Poblacion@$@^FS^CI27
^FT242,397^A0N,23,20^FH\^CI28^FD@$@Tipo de periodo@$@ ^FS^CI27
^FT242,423^A0N,23,20^FH\^CI28^FD@$@Consumo Promedio@$@^FS^CI27
^FT242,449^A0N,23,20^FH\^CI28^FD@$@Lecturista@$@^FS^CI27
^FT242,475^A0N,23,20^FH\^CI28^FD@$@No. serie del medidor@$@^FS^CI27
^FT245,565^A0N,23,23^FH\^CI28^FD@$@Consumo por periodo@$@^FS^CI27
^FT245,591^A0N,23,23^FH\^CI28^FD@$@Consumo total@$@^FS^CI27
^FT245,617^A0N,23,23^FH\^CI28^FD@$@Importe por periodo@$@^FS^CI27
^FT245,643^A0N,23,23^FH\^CI28^FD@$@Importe total@$@^FS^CI27
^FT245,669^A0N,23,23^FH\^CI28^FD@$@Lectura actual@$@^FS^CI27
^FT245,695^A0N,23,23^FH\^CI28^FD@$@Lectura anterior@$@^FS^CI27
^FT245,722^A0N,23,23^FH\^CI28^FD@$@Periodo actual@$@^FS^CI27
^FT245,748^A0N,23,23^FH\^CI28^FD@$@Periodo anterior@$@^FS^CI27
^FT245,774^A0N,23,23^FH\^CI28^FD@$@Periodos generados@$@^FS^CI27
^FT32,1112^A0N,31,25^FB515,1,8,C^FH\^CI28^FDFAVOR DE PASAR A RESOLVER ESTE PROBLEMA^FS^CI27
^FT32,1145^A0N,31,25^FB515,1,8,C^FH\^CI28^FDEN LAS OFICINAS DEL AGUA POTABLE^FS^CI27
^FO23,870,0^FB510,8,0,J,0 ^A0N,23,23 ^FH\^CI28^  ^FD@$@problemas@$@^FS^
^LRY^FO15,801^GB550,0,48^FS^LRN
^LRY^FO14,1070^GB550,0,94^FS^LRN
^PQ1,0,1,Y
^XZ
`;
}
