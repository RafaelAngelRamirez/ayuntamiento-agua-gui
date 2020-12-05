import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class PeriodoAMesesService {
  private equivalencia = [
    "Enero-Febrero",
    "Marzo-Abril",
    "Mayo-Junio",
    "Julio-Agosto",
    "Septiembre-Octubre",
    "Noviembre-Diciembre",
  ];

  constructor() {}

  /**
   *Convierte el periodo a un texto dupla tipo enero-febrero
   *
   * @param {number} periodo
   * @returns {string}
   * @memberof PeriodoAMesesService
   */
  obtenerNombre(periodo: number): string {
    return this.equivalencia[periodo - 1];
  }

  obtenerTipoDePeriodo(n: number): string {
    return [
      "Mensual",
      "Bimestral",
      "Trimestral",
      "Cuatrimestre",
      "Quinquemestre",
      "Semestre",
    ][n];
  }
}
