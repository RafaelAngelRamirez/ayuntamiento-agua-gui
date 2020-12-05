import { Injectable } from "@angular/core";
import { Lectura, Contrato } from "./contrato.service";
import { Lecturista, Tarifas, ParametrosSIMAPA } from '../models/usuario.model'

@Injectable({
  providedIn: "root",
})
export class CalculosTicketService {
  constructor() {}

  /**
   *Obtiene los periodos (bimestrales) en base a vigencia y periodos
   * actuales y anterioes.
   *
   * @param {string} vigenciaActual
   * @param {string} periodoActual
   * @param {number} vigenciaAnterior
   * @param {string} periodoAnterior
   * @returns
   * @memberof CalculosTicketService
   */
  calcularPeriodo(
    vigenciaActual: number,
    periodoActual: number,
    vigenciaAnterior: number,
    periodoAnterior: number
  ) {
    let periodosCalculados = 0;

    // No sirve una vigencia menor que 2018...
    vigenciaAnterior =
      vigenciaAnterior > 2018 ? vigenciaAnterior : vigenciaActual;
    periodoAnterior = periodoAnterior > 0 ? periodoAnterior : periodoActual;

    periodosCalculados =
      // 6 periodos en bimestral
      (vigenciaActual - vigenciaAnterior) * 6 + periodoActual - periodoAnterior;
    return periodosCalculados < 1 ? 1 : periodosCalculados;
  }

  /**
   *
   * Calcula el mporte
   * @param {Lectura} lectura
   * @param {Contrato} contrato
   * @param {Lecturista} lecturista
   * @returns {number}
   * @memberof CalculosTicketService
   */
  calcularImporte(
    lectura: Lectura,
    parametros: ParametrosSIMAPA,
    IdTarifa: string,

    vigenciaActual: number,
    periodoActual: number,
    vigenciaAnterior: number,
    periodoAnterior: number
  ): number {
    //Obtenemos las tarifas(Parece que hay un problema con el nombre del tipo de tarifa y tiene un espacio al final. Usamos trim para evitar purrunes. )
    let tarifas = parametros?.tarifas.filter((x) => {
      return x.IdTarifa.trim() === IdTarifa.trim();
    });

    console.log(`tarifas`, tarifas);

    //La cantidad de periodos que se estan cobrando.
    let periodosGenerados = this.calcularPeriodo(
      vigenciaActual,
      periodoActual,
      vigenciaAnterior,
      periodoAnterior
    );

    let mesesGenerados = periodosGenerados * 2;

    // El consumo que viene de la diferencia de la lectura anterior y la lectura actual.
    let consumoActualPorMes = lectura.ConsumoMts3 / mesesGenerados;

    console.log(`consumoActual`, consumoActualPorMes);

    // let servicios = [];
    // Obtenemos aguasResiduales
    let aguasResiduales = parametros.aguasResiduales[0]
      ? parametros.aguasResiduales[0].Porcentaje
      : null;
    //Obtenemos drenaje
    let drenaje = parametros.drenaje[0]
      ? parametros.drenaje[0].Porcentaje
      : null;
    // Obtenemos infrastructura
    let infrastructura = parametros.infrastructura[0]
      ? parametros.infrastructura[0].Porcentaje
      : null;

    console.log(`aguasResiduales`, aguasResiduales);
    console.log(`drenaje`, drenaje);
    console.log(`infrastructura`, infrastructura);

    // //Recorremos las tarifas
    let importeTotal = 0;

    let desgloses: {
      tarifa: Tarifas;
      min: number;
      max: number;
      consumoActualMt3: number;
      costoM3: number;
      cuotaMinima: number;
      importeRango: number;

      metrosCalculados: number;
    }[] = [];

    for (const t of tarifas) {
      //Si no esta igual comprobamos hasta donde haq que cobrar

      let desglose = {
        importeRango: 0,
        metrosCalculados: 0,
        tarifa: t,
        min: t.ConsumoMinimo,
        max: t.ConsmuoMaximo,
        // El consumo actual tiene que ser divido entre la cantidad de periodos
        // generados y el total  de periodos.
        consumoActualMt3: consumoActualPorMes,
        costoM3: t.CostoMt3Excedente,
        cuotaMinima: t.CuotaMinima,
      };
      let subImporte = 0;
      if (consumoActualPorMes >= t.ConsmuoMaximo) {
        //El costo del rango
        desglose.metrosCalculados = t.ConsmuoMaximo - t.ConsumoMinimo + 1;

        subImporte =
          desglose.metrosCalculados * t.CostoMt3Excedente + t.CuotaMinima;
      } else {
        if (consumoActualPorMes >= t.ConsumoMinimo) {
          //AQUI LA HAN CAGAO con el -1
          desglose.metrosCalculados = consumoActualPorMes - t.ConsumoMinimo + 1;
          subImporte =
            desglose.metrosCalculados * t.CostoMt3Excedente + t.CuotaMinima;
        }
      }
      //Sumamos al importe global.
      importeTotal += subImporte;

      //Registramos el importe del rango en el desglose.
      desglose.importeRango = subImporte;
      desgloses.push(desglose);
    }
    console.log("desglose", desgloses);

    // Sumamos los porcentajes de servicios

    let importeAguasResiduales = aguasResiduales
      ? importeTotal * (aguasResiduales / 100)
      : 0;

    console.log(`importeAguasResiduales`, importeAguasResiduales);

    let importeInfrastructura = infrastructura
      ? importeTotal * (infrastructura / 100)
      : 0;

    console.log(`importeInfrastructura`, importeInfrastructura);

    let importeDrenaje = drenaje ? importeTotal * (drenaje / 100) : 0;

    console.log(`importeDrenaje`, importeDrenaje);

    let granTotal =
      (importeTotal +
        importeDrenaje +
        importeInfrastructura +
        importeAguasResiduales) *
      mesesGenerados;
    return granTotal;
  }
}
