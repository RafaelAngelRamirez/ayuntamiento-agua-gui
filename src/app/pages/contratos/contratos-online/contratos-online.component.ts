import { OnInit, Component } from "@angular/core";
import { FormControl } from "@angular/forms";
import { debounceTime, delay } from "rxjs/operators";
import { Contrato, ContratoService } from "../../../services/contrato.service";

@Component({
  selector: "app-contratos-online",
  templateUrl: "./contratos-online.component.html",
  styleUrls: ["./contratos-online.component.css"],
})
export class ContratosOnlineComponent implements OnInit {
  buscador = new FormControl();
  contratos: Contrato[] = [];

  constructor(private contratoService: ContratoService) {}

  ngOnInit(): void {
    this.registrarBuscadorOnline();
  }

  buscando = false;
  registrarBuscadorOnline() {
    this.buscador.valueChanges.pipe(debounceTime(1000)).subscribe(
      (value) => {
        if (!value.trim()) {
          this.contratos = [];
          return;
        }

        this.buscando = true;
        this.buscador.disable({ emitEvent: false });

        this.contratoService.findByTerm(value.trim()).subscribe(
          (contratos) => {
            this.contratos = contratos;
            this.buscando = false;
            this.buscador.enable({ emitEvent: false });
          },
          (_) => {
            this.buscando = false;
            this.buscador.enable({ emitEvent: false });
          }
        );
      },
      (_) => (this.buscando = false)
    );
  }
}
