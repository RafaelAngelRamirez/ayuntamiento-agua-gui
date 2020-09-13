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

  actualizar = new BehaviorSubject<boolean>(false);

  get imprimiendo() {
    return this._imprimiendo;
  }

  constructor(private router: Router) {}

  ticket(contrato: Contrato) {
    this._imprimiendo = true;
    this.contrato = contrato;

    this.router
      .navigate([
        "/",
        {
          outlets: {
            print: ["print", "ticket"],
          },
        },
      ])
      .then((algo) => {
        this.actualizar.next(true);
        setTimeout(() => {
          window.print();
        }, 100);
      });

    window.addEventListener("afterprint", () => {
      this._imprimiendo = false;
      this.router.navigate([
        "/",
        {
          outlets: {
            print: ["print"],
          },
        },
      ]);
    });
  }
}
