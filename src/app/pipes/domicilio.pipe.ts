import { Pipe, PipeTransform } from "@angular/core";
import { Contrato } from "../services/contrato.service";

@Pipe({
  name: "domicilio",
})
export class DomicilioPipe implements PipeTransform {
  transform(contrato: Contrato): string {
    return `${contrato.Calle} #${contrato.Exterior}, ${contrato.Colonia},
    ${contrato.Poblacion}`;
  }
}
