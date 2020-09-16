import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { Contrato } from "./contrato.service";

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

  constructor(private router: Router) {}

  ticket(contrato: Contrato) {
    this._imprimiendo = true;
    this.contrato = contrato;

    this.router.navigate(["/ticket"]).then((algo) => {
      this.actualizar.next(contrato);
      setTimeout(() => {
        window.print();
      }, 100);
    });

    window.addEventListener("afterprint", () => {
      this._imprimiendo = false;
      this.router.navigate(["/app/lectura"]);
    });
  }
}
