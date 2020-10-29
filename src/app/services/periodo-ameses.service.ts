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

  convertir(periodo: number): string {
    return this.equivalencia[periodo - 1];
  }
}
