import { DatePipe } from "@angular/common";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class FechaService {
  constructor(
    // Lo dejamos publico para tener todas las fechas disponibles
    // en este servicio
    public datePipe: DatePipe) {}

  /**
   *Retorna la feha desglosada en dia, mes, anio, hora, minutos, y segundos
   *
   * @param {(string | Date)} fecha
   * @returns {FechaDesglosada}
   * @memberof FechaService
   */
  desgloseDeFecha(fecha: string | Date): FechaDesglosada {
    let x: FechaDesglosada = {
      dia: 0,
      mes: 0,
      anio: 0,
      hora: 0,
      minutos: 0,
      segundos: 0,
    };

    let fechaOriginal = new Date(fecha);

    x.dia = fechaOriginal.getDate();
    x.mes = fechaOriginal.getMonth() + 1;
    x.anio = fechaOriginal.getFullYear();
    x.hora = fechaOriginal.getHours();
    x.minutos = fechaOriginal.getMinutes();
    x.segundos = fechaOriginal.getSeconds();

    return x;
  }

  /**
   *Agrega un prefijo a la estructura de FechaDesglosada para
   * presentar los datos con mayor comodidad
   *
   * @param {FechaDesglosada} fechaDesglosada
   * @param {string} prefijo
   * @returns {*}
   * @memberof FechaService
   */
  fechaConPrefijo(fechaDesglosada: FechaDesglosada, prefijo: string): any {
    let fecha: any = { ...fechaDesglosada };

    return Object.keys(fechaDesglosada).reduce((a: any, b) => {
      a[`${prefijo}_${b}`] = fecha[b];
      return a;
    }, {});
  }

  /**
   * Convertirmos al formato 2020-20-02
   * @param {string} fecha
   * @returns {string}
   * @memberof FechaService
   */
  fechaParaFiltros(fecha: string): string {
    let f = this.datePipe.transform(fecha, "yyyy-MM-dd");
    if (!f) return "";
    return f;
  }
}

export interface FechaDesglosada {
  dia: number;
  mes: number;
  anio: number;
  hora: number;
  minutos: number;
  segundos: number;
}
