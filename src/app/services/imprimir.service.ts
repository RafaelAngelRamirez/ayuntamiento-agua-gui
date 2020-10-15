import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { Contrato } from "./contrato.service";
import { ZebraService } from "./zebra/zebra.service";

@Injectable({
  providedIn: "root",
})
export class ImprimirService {
  contrato!: Contrato;
  private _imprimiendo = false;

  actualizar = new BehaviorSubject<Contrato | undefined>(undefined);

  get imprimiendo() {
    return this._imprimiendo;
  }

  constructor(private router: Router, private zebraService: ZebraService) {}

  ticket(contrato: Contrato) {
    this._imprimiendo = true;
    this.contrato = contrato;

    this.zebraService.writeToSelectedPrinter(this.DATOS_ZPL);
  }

  DATOS_ZPL = `
^XA
~TA000
~JSN
^LT0
^MNN
^MTD
^PON
^PMN
^LH0,0
^JMA
^PR6,6
~SD15
^JUS
^LRN
^CI27
^PA0,1,1,0
^XZ
^XA
^MMT
^PW609
^LL1199
^LS0
^FO346,688^GFA,289,8064,32,:Z64:eJzt2UsOAyEIBmBu4P1v6Q3ojLwbl+JsftKkls8dETRltphEQxccSYb3+pNeIf5+ZK1JeLtrTcRtryXh91yOBPwz/9sLv+LRn4h847Z/wc+7xwxMSXivU46xycFbnddAEMmXI83Dm12wVCQdEXi7j/Qy41QluyjBW12/V9oLRnFFhfe6/qyTge2tBr/kkrYqsd1Va8DPO3vUx5kNDXizpzPhg4KsP8EvuJcl79K5Db/peSbAv3CtUrQreLuX/kRRnG3/gh92j6lrKv+SwXv9Bx2QkMk=:C54B
^FT142,65^A0N,20,20^FB435,1,5,C^FH\^CI28^FDH. AYUNTAMIENTO DE ZAPOTLANEJO^FS^CI27
^FT142,84^A0N,20,20^FB435,1,5,C^FH\^CI28^FDDIRECCION DE AGUA POTABLE Y ALCANTARILLADO^FS^CI27
^FO11,8^GFA,681,1808,16,:Z64:eJy11MFy2yAQAFAyOujIJ/Ap/FZvS78gn9BPCZ4cevQniE4POVqaHIonCttll0VSJo57KTO2/AxaVovAGG42mEO7ZxeP9v/biOve+LWHOx7J+YPnL/rvxXvYe4iSzzcNlqR+OmCkyDTb0L1SvLVemouxSB/1UIxDNDZv9hnDZjR+heDUIwbAKXi932EErP81IybACzlp7mytwMDGoBX4zH7v4iPZwGNLAF10lD9YiW/AJ1vHT7HKBo8z1fdEf/maHQWbKeavOqR6lv4F8Ts7A84WL+Rn9pUS9dz/xsbaMn9vxpu2O5a21NpWfrzfpZaE6g2Zy8OOZC5QNaUbqjOPfykWn8hrMxaHvoYD8VS82It/FJDpnNgVPFgzLNqv6fGKU7nV5zYft6m9surzJKbcQTypi94w7922wMMVNd9X9TBvNu83LS8U3jGIH9Uey5h9ram6tyAGfULx3Hy64fyJExXgWQybJb+1+ac8fylHYzOeZYPUeoI4qbl/0vy7eT5azgvH49eNF+hFnHX/8fip7b9/dT+xupO6wN6A2X/wwI5ij+uYerl5QezR+LS3q7fWGgvpAT3SCTBtpp+0JUqz7rB+nt1wP8/+MN+7X2mzL3jtXjDDCRe935IpyKLz0wtRT9TU80++9sfu6KoNqIOdadnpSvgLz1FSdw==:6A14
^FT38,205^A0N,20,20^FH\^CI28^FDColonia:	CENTRO^FS^CI27
^FT38,224^A0N,20,20^FH\^CI28^FDConsumoPromedio:	57.6666^FS^CI27
^FT38,243^A0N,20,20^FH\^CI28^FDContrato:	00000004^FS^CI27
^FT38,263^A0N,20,20^FH\^CI28^FDContribuyente:	ACEVES ALVAREZ J. CONCEPCION^FS^CI27
^FT38,282^A0N,20,20^FH\^CI28^FDDireccion:	PORFIRIO DIAZ #20, CENTRO, ZAPOTLANEJO^FS^CI27
^FT38,301^A0N,20,20^FH\^CI28^FDLecturista:	Admin^FS^CI27
^FT38,321^A0N,20,20^FH\^CI28^FDNo. serie del medidor:	474442^FS^CI27
^FT38,340^A0N,20,20^FH\^CI28^FDPoblacion:	ZAPOTLANEJO^FS^CI27
^FT38,359^A0N,20,20^FH\^CI28^FDTipo de periodo:	2^FS^CI27
^FT38,164^A0N,23,23^FH\^CI28^FDDATOS GENERALES^FS^CI27
^FT38,443^A0N,20,20^FH\^CI28^FDConsumo por periodo:	SIN DEFINIR PERIODO^FS^CI27
^FT38,462^A0N,20,20^FH\^CI28^FDConsumo total:	SIN DEFINR CONSUMO TOTAL^FS^CI27
^FT38,481^A0N,20,20^FH\^CI28^FDImporte por periodo:	SIN DEFINIR IMPORTE ^FS^CI27
^FT38,501^A0N,20,20^FH\^CI28^FDImporte total:	SIN DEFINIR IMPORTE TOTAL^FS^CI27
^FT38,520^A0N,20,20^FH\^CI28^FDLectura actual:	^FS^CI27
^FT38,539^A0N,20,20^FH\^CI28^FDLectura anterior:	2738^FS^CI27
^FT38,559^A0N,20,20^FH\^CI28^FDPeriodo actual:	SIN DEFINIR PERIODO ACTUAL^FS^CI27
^FT38,578^A0N,20,20^FH\^CI28^FDPeriodo anterior:	03^FS^CI27
^FT38,597^A0N,20,20^FH\^CI28^FDPeriodos generados:	SIND DEFINIR PERIODOS GENERADOS^FS^CI27
^FT38,401^A0N,23,23^FH\^CI28^FDDATOS DE LA LECTURA^FS^CI27
^FO28,172^GB542,0,3^FS
^FO28,411^GB542,0,3^FS
^FT17,742^A0N,28,25^FH\^CI28^FDAdeudo anterior: $ 5,500.00^FS^CI27
^FT17,771^A0N,28,25^FH\^CI28^FDImporte: $6,000.00^FS^CI27
^FT17,800^A0N,28,25^FH\^CI28^FDSaldo a favor: $8000.00^FS^CI27
^FT20,685^A0N,23,23^FH\^CI28^FDESTADO DE CUENTA^FS^CI27
^FO6,994^GB592,0,3^FS
^FT126,1026^A0N,23,23^FH\^CI28^FDCUIDAR EL AGUA ES MISION DE TODOS^FS^CI27
^FT17,1067^A0N,17,18^FB580,1,4,C^FH\^CI28^FDSirva de realizar el pago de este comprobante a partir del siguiente dia habil ^FS^CI27
^FT17,1088^A0N,17,18^FB580,1,4,C^FH\^CI28^FDde la fecha que señala este recibo. Despues de 4 meses de adeudo se ^FS^CI27
^FT17,1109^A0N,17,18^FB580,1,4,C^FH\^CI28^FDaplicara sanción de acuerdo con el Art. 72, Fracc. IV, Inc. F de la ley de^FS^CI27
^FT17,1130^A0N,17,18^FB580,1,4,C^FH\^CI28^FD ingresos municipales.^FS^CI27
^PQ1,0,1,Y
^XZ

    `;
}
